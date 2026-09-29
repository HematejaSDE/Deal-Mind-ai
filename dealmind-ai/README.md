# DealMind AI

**DealMind AI turns scattered sales activity into a deal desk that remembers.** It is a Hindsight-powered workspace for account executives and sales leaders who need to know what happened, what it means, and what to do next without re-reading every call note.

![DealMind AI dashboard](./public/dealmind-logo.png)

## The problem

Most CRMs store fields; they do not learn from the deal. Buyer commitments sit in call notes, objections are buried in emails, and a rep's hard-won lessons disappear when the opportunity changes hands. That creates fragile forecasts and generic next-step advice.

## The DealMind loop

| Moment                                      | DealMind behavior                                                           | Hindsight capability                  |
| ------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| A rep logs a call outcome or buyer signal   | Retains the raw activity with a strict account tag                          | `retain`                              |
| A rep prepares for a meeting                | Retrieves only that account's evidence and creates a grounded brief         | `reflect` + `tagsMatch: "all_strict"` |
| A deal evolves                              | Hindsight consolidates repeated signals into observations and mental models | Persistent memory and reflection      |
| A manager asks why a recommendation changed | The interface surfaces the memories used to make it                         | `includeFacts: true`                  |

Every account is tagged as `account:<slug>`. DealMind requests memory with `all_strict`, so a brief for Northstar Labs cannot draw on an unrelated buyer's activity.

## Run it

1. Start a Hindsight API from the repository root:

   ```bash
   ./scripts/dev/start-api.sh
   ```

2. In a second terminal, configure and start DealMind:

   ```bash
   cd dealmind-ai
   cp .env.example .env.local
   npm install
   npm run dev
   ```

3. Visit [http://localhost:3001](http://localhost:3001).

`HINDSIGHT_API_URL` defaults to `http://localhost:8888`. Add `HINDSIGHT_API_KEY` to `.env.local` when the memory service uses bearer authentication.

The dashboard is intentionally presentation-ready with seeded accounts before Hindsight is online. The **Log signal** and **Ask DealMind** actions only say a signal was persisted after Hindsight confirms it; otherwise the UI explicitly reports that the service is offline.

## A strong hackathon demo

1. Open **Northstar Labs** and explain the recommendation to send a phased rollout plan.
2. Log: “Maya said budget is ready if security approves SSO this week.”
3. Click **Refresh from memory** or ask, “What could stall this deal?”
4. Show the answer, risks, and source signals returned from Hindsight.
5. Switch to **Orbital Health** to demonstrate strict account isolation and a different learned plan.

## Why it is more than a dashboard

DealMind makes the memory layer visible and useful:

- It learns deal context over time instead of resetting every chat.
- It translates raw customer evidence into an actionable next move.
- It makes recommendations inspectable through the remembered signals that informed them.
- It keeps buyer intelligence scoped to the right account, a basic requirement for trustworthy sales AI.
