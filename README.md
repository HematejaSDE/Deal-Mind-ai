# DealMind AI

> Persistent deal intelligence for sales teams that need every next move to be grounded in what buyers actually said.

DealMind AI turns scattered calls, emails, and meeting notes into a focused deal desk that remembers the full account story. It helps account executives and sales leaders see momentum, surface risks, and act on the evidence—not a generic summary.

[Explore the product](https://github.com/HematejaSDE/DealMind-AI) · [Run locally](#run-locally) · [How it works](#how-it-works)

## The problem

CRMs are great at storing fields, but crucial buyer context is usually trapped in call notes, inboxes, and a rep’s memory. As a deal moves, commitments get lost, objections are repeated, and handoffs weaken the forecast.

DealMind gives each account a durable memory layer so the team can always answer:

- What changed in this deal?
- What could stall it?
- What should we do next—and why?
- Which buyer signals support that recommendation?

## What DealMind does

| Capability | Outcome |
| --- | --- |
| **Capture deal signals** | Turn call outcomes, objections, commitments, and meeting notes into lasting account memory. |
| **Build a grounded brief** | Bring the relevant evidence together before a meeting or forecast review. |
| **Recommend the next move** | Surface a precise action based on buyer intent, momentum, and risk signals. |
| **Show the evidence** | Keep recommendations inspectable by linking them to the remembered signals behind them. |
| **Protect account boundaries** | Retrieve memory only from the selected account to prevent cross-deal context leakage. |

## How it works

```text
Sales activity
  → retain account-scoped evidence
  → consolidate recurring signals into deal understanding
  → retrieve the right context for the moment
  → recommend a next move with its supporting evidence
```

Every record is scoped with an `account:<slug>` tag. When DealMind prepares a brief, it retrieves only the selected account’s memory with strict tag matching. That isolation is essential for trustworthy sales AI.

## A five-minute demo

1. Open **Northstar Labs** and review the recommendation to send a phased rollout plan.
2. Log a new buyer signal: “Budget is ready if security approves SSO this week.”
3. Ask DealMind: **What could stall this deal?**
4. Review the answer, risk signals, and the source evidence behind the recommendation.
5. Switch to another account to demonstrate that its learned plan and history remain isolated.

## Run locally

The current application source is in [DealMind-AI](https://github.com/HematejaSDE/DealMind-AI), under `Deepmind-main/dealmind-ai`.

```bash
git clone https://github.com/HematejaSDE/DealMind-AI.git
cd DealMind-AI/Deepmind-main

# Start the Hindsight memory API
./scripts/dev/start-api.sh

# In a second terminal
cd dealmind-ai
cp .env.example .env.local
npm install
npm run dev
```

Then open [http://localhost:3001](http://localhost:3001).

DealMind uses `http://localhost:8888` by default for the Hindsight API. Add `HINDSIGHT_API_KEY` to `.env.local` when your memory service requires bearer authentication.

## Built with

- **Next.js** and **React** for the deal desk interface
- **Hindsight** for persistent, account-scoped memory and retrieval
- **TypeScript** for reliable application logic
- **Lucide** for a clean, focused product interface

## Principles

- **Evidence over guesswork** — recommendations should be traceable to real buyer signals.
- **Memory that compounds** — every useful interaction improves the next conversation.
- **Account isolation by default** — one customer’s context never informs another customer’s plan.
- **Actionable, not ornamental** — insight matters only when it helps the team move a deal forward.

## Contributing

Ideas, feedback, and pull requests are welcome. If you spot a gap in the sales workflow, open an issue with the buyer context, desired outcome, and the signal that should trigger it.

---

Built for sales teams that want their deal desk to remember the details that matter.
