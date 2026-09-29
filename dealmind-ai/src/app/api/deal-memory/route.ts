import { HindsightClient } from "@vectorize-io/hindsight-client";

export const runtime = "nodejs";

const dealMindBankId = process.env.DEALMIND_BANK_ID ?? "dealmind";

const dealBriefSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    healthScore: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    nextBestAction: { type: "string" },
    whyNow: { type: "string" },
    risks: { type: "array", items: { type: "string" } },
  },
  required: ["healthScore", "summary", "nextBestAction", "whyNow", "risks"],
} as const;

type DealMemoryRequest =
  | { action: "retain"; account: string; content: string; source?: string }
  | { action: "brief"; account: string; query: string };

function isDealMemoryRequest(value: unknown): value is DealMemoryRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;
  const hasAccount = typeof request.account === "string" && request.account.trim().length > 0;
  const hasValidSource = request.source === undefined || typeof request.source === "string";

  if (request.action === "retain") {
    return (
      hasAccount &&
      hasValidSource &&
      typeof request.content === "string" &&
      request.content.trim().length > 0
    );
  }

  return (
    request.action === "brief" &&
    hasAccount &&
    typeof request.query === "string" &&
    request.query.trim().length > 0
  );
}

function accountTag(account: string): string {
  const slug = account
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `account:${slug || "unknown"}`;
}

async function dealMindClient(): Promise<HindsightClient> {
  const client = new HindsightClient({
    baseUrl: process.env.HINDSIGHT_API_URL ?? "http://localhost:8888",
    apiKey: process.env.HINDSIGHT_API_KEY,
    userAgent: "dealmind-ai/0.1.0",
  });

  // Provisioning is idempotent so a hackathon demo starts with a correctly scoped brain,
  // while still allowing deployments to choose their own bank ID through the environment.
  await client.createBank(dealMindBankId, {
    reflectMission:
      "You are DealMind, a rigorous deal strategist. Make recommendations only from remembered buyer evidence. Separate facts from inference, surface uncertainty, and protect customer confidentiality.",
    retainMission:
      "Extract durable sales intelligence: buyer goals, stakeholders, commitments, objections, dates, decision process, risks, competitors, and outcomes. Keep each account's information distinct.",
    enableObservations: true,
  });

  return client;
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send a valid JSON request." }, { status: 400 });
  }

  if (!isDealMemoryRequest(payload)) {
    return Response.json(
      { error: "Provide an action, account, and non-empty deal content." },
      { status: 400 }
    );
  }

  try {
    const client = await dealMindClient();
    const scopedTag = accountTag(payload.account);

    if (payload.action === "retain") {
      await client.retain(dealMindBankId, payload.content, {
        context: `Deal activity for ${payload.account}`,
        documentId: `deal-${scopedTag}-activity`,
        updateMode: "append",
        metadata: {
          source: payload.source ?? "DealMind workspace",
          account: payload.account,
        },
        tags: [scopedTag],
      });

      return Response.json({ ok: true, message: "Deal signal retained in Hindsight." });
    }

    const response = await client.reflect(
      dealMindBankId,
      [
        `Account: ${payload.account}`,
        `Sales leader question: ${payload.query}`,
        "Create a concise deal brief. Do not invent buyer facts. If evidence is missing, name the uncertainty and suggest how to resolve it.",
      ].join("\n\n"),
      {
        budget: "mid",
        tags: [scopedTag],
        // Strict matching prevents evidence from another account (or global notes) leaking into this brief.
        tagsMatch: "all_strict",
        includeFacts: true,
        responseSchema: dealBriefSchema,
      }
    );

    return Response.json({
      answer: response.text,
      brief: response.structured_output,
      sources: response.based_on,
    });
  } catch (error) {
    console.error("DealMind Hindsight request failed", error);
    return Response.json(
      {
        error:
          "DealMind could not reach Hindsight. Start the memory API and confirm HINDSIGHT_API_URL.",
      },
      { status: 503 }
    );
  }
}
