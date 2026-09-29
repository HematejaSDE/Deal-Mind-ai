"use client";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BookOpenText,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDotDashed,
  Clock3,
  Command,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Deal = {
  id: string;
  account: string;
  initials: string;
  logoTone: "lavender" | "peach" | "mint";
  amount: string;
  stage: string;
  days: number;
  health: number;
  healthLabel: "Healthy" | "Watch" | "At risk";
  change: string;
  nextAction: string;
  whyNow: string;
  buyer: string;
  role: string;
  champion: string;
  decision: string;
  close: string;
  lastActivity: string;
  memories: Array<{ time: string; label: string; text: string; tone: "good" | "risk" | "neutral" }>;
  timeline: Array<{
    date: string;
    title: string;
    description: string;
    type: "meeting" | "signal" | "task";
  }>;
};

const deals: Deal[] = [
  {
    id: "northstar",
    account: "Northstar Labs",
    initials: "NL",
    logoTone: "lavender",
    amount: "$84,000",
    stage: "Proposal",
    days: 18,
    health: 74,
    healthLabel: "Healthy",
    change: "+8 this week",
    nextAction: "Send a two-option rollout plan before Wednesday's security review.",
    whyNow:
      "Maya asked for implementation details and confirmed that finance can release budget this quarter.",
    buyer: "Maya Chen",
    role: "VP, Revenue Operations",
    champion: "High confidence",
    decision: "Security review → CFO approval",
    close: "Oct 18",
    lastActivity: "2h ago",
    memories: [
      {
        time: "Today, 9:42 AM",
        label: "Buyer intent",
        text: "Maya asked for a phased rollout that proves value before the full team is onboarded.",
        tone: "good",
      },
      {
        time: "Yesterday, 4:17 PM",
        label: "Risk signal",
        text: "Security needs SSO and a data-retention answer before approving the pilot.",
        tone: "risk",
      },
      {
        time: "Sep 24, 11:08 AM",
        label: "Deal history",
        text: "The team chose a 60-day pilot after a manual reporting workflow created a six-hour delay.",
        tone: "neutral",
      },
    ],
    timeline: [
      {
        date: "Today",
        title: "Decision signal captured",
        description: "Budget timing confirmed for this quarter.",
        type: "signal",
      },
      {
        date: "Sep 27",
        title: "Security review booked",
        description: "Maya added the identity lead and procurement partner.",
        type: "meeting",
      },
      {
        date: "Sep 24",
        title: "Pilot scope agreed",
        description: "Start with the RevOps analytics team of 42 people.",
        type: "task",
      },
    ],
  },
  {
    id: "orbital",
    account: "Orbital Health",
    initials: "OH",
    logoTone: "peach",
    amount: "$126,000",
    stage: "Discovery",
    days: 31,
    health: 51,
    healthLabel: "Watch",
    change: "-6 this week",
    nextAction:
      "Reconfirm the executive problem statement with Jordan before scheduling a product review.",
    whyNow: "Two meetings were moved and the economic buyer has not joined a call yet.",
    buyer: "Jordan Patel",
    role: "Director, Clinical Systems",
    champion: "Developing",
    decision: "Clinical systems + finance",
    close: "Nov 06",
    lastActivity: "1d ago",
    memories: [
      {
        time: "Yesterday",
        label: "Risk signal",
        text: "The product review moved for the second time without a new date.",
        tone: "risk",
      },
      {
        time: "Sep 23",
        label: "Buyer intent",
        text: "Jordan wants to replace disconnected reporting across six regional teams.",
        tone: "good",
      },
      {
        time: "Sep 19",
        label: "Deal history",
        text: "Finance asked for a cost-of-delay model before considering a pilot.",
        tone: "neutral",
      },
    ],
    timeline: [
      {
        date: "Yesterday",
        title: "Product review moved",
        description: "No replacement time has been selected.",
        type: "signal",
      },
      {
        date: "Sep 23",
        title: "Discovery interview",
        description: "Fragmented reporting is blocking weekly capacity planning.",
        type: "meeting",
      },
      {
        date: "Sep 19",
        title: "Cost model requested",
        description: "Finance requires a quantified efficiency case.",
        type: "task",
      },
    ],
  },
  {
    id: "catalyst",
    account: "Catalyst Grid",
    initials: "CG",
    logoTone: "mint",
    amount: "$59,000",
    stage: "Negotiation",
    days: 43,
    health: 88,
    healthLabel: "Healthy",
    change: "+4 this week",
    nextAction: "Ask procurement to confirm the final redlines and mutual action plan by Friday.",
    whyNow:
      "Legal accepted the security addendum and the executive sponsor has asked for an October launch.",
    buyer: "Tomas Reed",
    role: "Head of Business Technology",
    champion: "High confidence",
    decision: "Procurement + legal redlines",
    close: "Oct 09",
    lastActivity: "5h ago",
    memories: [
      {
        time: "Today",
        label: "Buyer intent",
        text: "Tomas requested an October launch to align with the field planning cycle.",
        tone: "good",
      },
      {
        time: "Sep 26",
        label: "Deal history",
        text: "Legal accepted the revised security addendum with one indemnity note.",
        tone: "neutral",
      },
      {
        time: "Sep 20",
        label: "Risk signal",
        text: "Procurement still needs final usage tiers before issuing the order form.",
        tone: "risk",
      },
    ],
    timeline: [
      {
        date: "Today",
        title: "Launch window confirmed",
        description: "Executive sponsor wants an October rollout.",
        type: "signal",
      },
      {
        date: "Sep 26",
        title: "Security addendum accepted",
        description: "Legal requested one indemnity clarification.",
        type: "meeting",
      },
      {
        date: "Sep 20",
        title: "Usage tiers pending",
        description: "Procurement needs final seats and expansion options.",
        type: "task",
      },
    ],
  },
];

type LiveBrief = {
  answer: string;
  healthScore?: number;
  summary?: string;
  nextBestAction?: string;
  whyNow?: string;
  risks?: string[];
};

function briefFromResponse(value: unknown): LiveBrief | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const response = value as Record<string, unknown>;
  const brief =
    typeof response.brief === "object" && response.brief !== null
      ? (response.brief as Record<string, unknown>)
      : null;

  return {
    answer:
      typeof response.answer === "string"
        ? response.answer
        : "DealMind refreshed the account memory.",
    healthScore: typeof brief?.healthScore === "number" ? brief.healthScore : undefined,
    summary: typeof brief?.summary === "string" ? brief.summary : undefined,
    nextBestAction: typeof brief?.nextBestAction === "string" ? brief.nextBestAction : undefined,
    whyNow: typeof brief?.whyNow === "string" ? brief.whyNow : undefined,
    risks: Array.isArray(brief?.risks)
      ? brief.risks.filter((risk): risk is string => typeof risk === "string")
      : undefined,
  };
}

function healthClass(health: number): string {
  if (health >= 75) return "health-good";
  if (health >= 55) return "health-watch";
  return "health-risk";
}

export default function Home() {
  const [selectedId, setSelectedId] = useState(deals[0].id);
  const [isSignalOpen, setIsSignalOpen] = useState(false);
  const [signal, setSignal] = useState("");
  const [signalState, setSignalState] = useState<"idle" | "saving" | "saved" | "demo">("idle");
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [liveBrief, setLiveBrief] = useState<LiveBrief | null>(null);
  const [briefError, setBriefError] = useState("");

  const selectedDeal = useMemo(
    () => deals.find((deal) => deal.id === selectedId) ?? deals[0],
    [selectedId]
  );
  const displayedHealth = liveBrief?.healthScore ?? selectedDeal.health;
  const displayedAction = liveBrief?.nextBestAction ?? selectedDeal.nextAction;
  const displayedWhyNow = liveBrief?.whyNow ?? selectedDeal.whyNow;

  async function refreshBrief(query = "What is the next best action to advance this deal?") {
    setAsking(true);
    setBriefError("");

    try {
      const response = await fetch("/api/deal-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "brief", account: selectedDeal.account, query }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error("Hindsight is unavailable");
      }

      const parsedBrief = briefFromResponse(payload);
      if (!parsedBrief) {
        throw new Error("DealMind returned an invalid brief");
      }

      setLiveBrief(parsedBrief);
    } catch {
      setBriefError(
        "Hindsight is not connected yet. The seeded brief below keeps the demo moving."
      );
    } finally {
      setAsking(false);
    }
  }

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    await refreshBrief(trimmedQuestion);
    setQuestion("");
  }

  async function saveSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedSignal = signal.trim();
    if (!trimmedSignal) return;

    setSignalState("saving");
    try {
      const response = await fetch("/api/deal-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "retain",
          account: selectedDeal.account,
          content: trimmedSignal,
          source: "DealMind signal log",
        }),
      });

      if (!response.ok) throw new Error("Hindsight is unavailable");
      setSignalState("saved");
      setSignal("");
    } catch {
      // The visual demo remains useful offline, but the status never claims the note was persisted.
      setSignalState("demo");
    }
  }

  function chooseDeal(dealId: string) {
    setSelectedId(dealId);
    setLiveBrief(null);
    setBriefError("");
    setSignalState("idle");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <BrainCircuit size={20} strokeWidth={2.4} />
          </div>
          <span>
            dealmind<span className="brand-dot">.ai</span>
          </span>
        </div>

        <div className="workspace-picker">
          <div className="workspace-avatar">OS</div>
          <div>
            <span>Oliver's workspace</span>
            <small>Growth team</small>
          </div>
          <ChevronDown size={15} />
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <button className="nav-item active">
            <LayoutGrid size={18} />
            Overview
          </button>
          <button className="nav-item">
            <Target size={18} />
            Deals<span className="nav-count">12</span>
          </button>
          <button className="nav-item">
            <Activity size={18} />
            Activity
          </button>
          <button className="nav-item">
            <BookOpenText size={18} />
            Playbooks
          </button>
        </nav>

        <section className="deals-nav">
          <div className="section-heading">
            <span>My active deals</span>
            <button aria-label="Add deal">
              <Plus size={15} />
            </button>
          </div>
          <div className="deal-list">
            {deals.map((deal) => (
              <button
                className={`deal-nav-item ${selectedId === deal.id ? "selected" : ""}`}
                key={deal.id}
                onClick={() => chooseDeal(deal.id)}
              >
                <span className={`account-logo ${deal.logoTone}`}>{deal.initials}</span>
                <span className="deal-nav-copy">
                  <strong>{deal.account}</strong>
                  <small>
                    {deal.amount} · {deal.stage}
                  </small>
                </span>
                <span className={`mini-health ${healthClass(deal.health)}`}>{deal.health}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="sidebar-footer">
          <button className="nav-item">
            <Settings size={18} />
            Settings
          </button>
          <button className="nav-item">
            <HelpCircle size={18} />
            Help center
          </button>
          <div className="memory-status">
            <span className="status-pulse" />
            Hindsight memory on
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Deals</span>
            <span>/</span>
            <strong>{selectedDeal.account}</strong>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>
            <button className="ask-button" onClick={() => refreshBrief()} disabled={asking}>
              <Sparkles size={16} />
              {asking ? "Thinking…" : "Ask DealMind"}
              <span className="shortcut">
                <Command size={11} />K
              </span>
            </button>
            <button className="avatar-button">OL</button>
          </div>
        </header>

        <div className="content">
          <section className="deal-heading">
            <div className={`account-logo large ${selectedDeal.logoTone}`}>
              {selectedDeal.initials}
            </div>
            <div>
              <div className="eyebrow">
                {selectedDeal.stage} · {selectedDeal.days} days in cycle
              </div>
              <h1>{selectedDeal.account}</h1>
              <p>
                {selectedDeal.amount} potential ARR <span>•</span> Last activity{" "}
                {selectedDeal.lastActivity}
              </p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button">
                <MoreHorizontal size={18} />
                More
              </button>
              <button className="primary-button" onClick={() => setIsSignalOpen(true)}>
                <Plus size={17} />
                Log signal
              </button>
            </div>
          </section>

          <section className="metric-row" aria-label="Deal metrics">
            <div className="metric-card health-card">
              <div className="metric-label">
                <span>Deal health</span>
                <ShieldCheck size={17} />
              </div>
              <div className="health-score-row">
                <strong>{displayedHealth}</strong>
                <span className={`health-pill ${healthClass(displayedHealth)}`}>
                  {displayedHealth >= 75 ? "Healthy" : displayedHealth >= 55 ? "Watch" : "At risk"}
                </span>
              </div>
              <div className="health-track">
                <i
                  className={healthClass(displayedHealth)}
                  style={{ width: `${displayedHealth}%` }}
                />
              </div>
              <small>
                {selectedDeal.change} <span>from buyer signals</span>
              </small>
            </div>
            <div className="metric-card">
              <div className="metric-label">
                <span>Champion</span>
                <UsersRound size={17} />
              </div>
              <strong>{selectedDeal.champion}</strong>
              <small>
                {selectedDeal.buyer} · {selectedDeal.role}
              </small>
            </div>
            <div className="metric-card">
              <div className="metric-label">
                <span>Decision path</span>
                <ArrowUpRight size={17} />
              </div>
              <strong>{selectedDeal.decision}</strong>
              <small>Expected close {selectedDeal.close}</small>
            </div>
            <div className="metric-card">
              <div className="metric-label">
                <span>Next commitment</span>
                <CalendarDays size={17} />
              </div>
              <strong>Security review</strong>
              <small>Wednesday · 10:30 AM</small>
            </div>
          </section>

          <section className="memory-hero">
            <div className="hero-icon">
              <Sparkles size={20} />
            </div>
            <div className="hero-copy">
              <span>DEALMIND RECOMMENDATION</span>
              <h2>{displayedAction}</h2>
              <p>{displayedWhyNow}</p>
            </div>
            <button className="hero-button" onClick={() => refreshBrief()} disabled={asking}>
              {asking ? "Refreshing…" : "Refresh from memory"}
              <ArrowUpRight size={16} />
            </button>
          </section>
          {briefError && (
            <p className="connection-note">
              <AlertCircle size={15} />
              {briefError}
            </p>
          )}
          {liveBrief?.summary && (
            <section className="live-summary">
              <Sparkles size={16} />
              <div>
                <strong>Live Hindsight brief</strong>
                <p>{liveBrief.summary}</p>
              </div>
            </section>
          )}

          <div className="dashboard-grid">
            <section className="panel buyer-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">RELATIONSHIP INTELLIGENCE</span>
                  <h2>Buyer map</h2>
                </div>
                <button className="text-button">
                  View all <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="buyer-card primary-buyer">
                <div className="person-avatar maya">MC</div>
                <div className="buyer-copy">
                  <div>
                    <h3>{selectedDeal.buyer}</h3>
                    <span className="role-pill">Champion</span>
                  </div>
                  <p>{selectedDeal.role}</p>
                  <div className="buyer-signal">
                    <CheckCircle2 size={15} />
                    High engagement · 4 signals this week
                  </div>
                </div>
                <button className="icon-button muted" aria-label="Buyer options">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className="buyer-grid">
                <div>
                  <span className="mini-label">ECONOMIC BUYER</span>
                  <strong>
                    {selectedDeal.id === "northstar"
                      ? "Elena Torres"
                      : selectedDeal.id === "orbital"
                        ? "Priya Shah"
                        : "Marcus Allen"}
                  </strong>
                  <small>Not yet engaged</small>
                </div>
                <div>
                  <span className="mini-label">BLOCKER</span>
                  <strong>
                    {selectedDeal.id === "northstar"
                      ? "Ravi Shah"
                      : selectedDeal.id === "orbital"
                        ? "Procurement"
                        : "Contract redlines"}
                  </strong>
                  <small>
                    {selectedDeal.id === "northstar" ? "Identity & Security" : "Needs a clear path"}
                  </small>
                </div>
              </div>
              <div className="connection-line">
                <span />
                <span />
                <span />
              </div>
              <div className="learning-note">
                <BrainCircuit size={17} />
                <p>
                  <strong>What DealMind learned</strong>
                  {selectedDeal.buyer.split(" ")[0]} consistently pulls in stakeholders early when a
                  rollout has executive support.
                </p>
              </div>
            </section>

            <section className="panel timeline-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">MOMENTUM</span>
                  <h2>Deal timeline</h2>
                </div>
                <button className="text-button">
                  All activity <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="timeline">
                {selectedDeal.timeline.map((item) => (
                  <div className="timeline-item" key={item.title}>
                    <div className={`timeline-dot ${item.type}`}>
                      {item.type === "meeting" ? (
                        <MessageSquare size={13} />
                      ) : item.type === "task" ? (
                        <CircleDotDashed size={13} />
                      ) : (
                        <Zap size={13} />
                      )}
                    </div>
                    <div>
                      <span>{item.date}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="timeline-footer">
                <Clock3 size={16} />
                DealMind is watching for changes in buyer momentum
              </div>
            </section>

            <section className="panel memory-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-kicker">HINDSIGHT MEMORY</span>
                  <h2>Signals that changed the plan</h2>
                </div>
                <span className="memory-count">{selectedDeal.memories.length + 18} memories</span>
              </div>
              <div className="memory-feed">
                {selectedDeal.memories.map((memory) => (
                  <article className="memory-item" key={memory.text}>
                    <div className={`memory-icon ${memory.tone}`}>
                      {memory.tone === "good" ? (
                        <CheckCircle2 size={15} />
                      ) : memory.tone === "risk" ? (
                        <AlertCircle size={15} />
                      ) : (
                        <MessageSquare size={15} />
                      )}
                    </div>
                    <div>
                      <div className="memory-meta">
                        <span>{memory.label}</span>
                        <time>{memory.time}</time>
                      </div>
                      <p>{memory.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              {liveBrief?.risks && liveBrief.risks.length > 0 && (
                <div className="risk-strip">
                  <AlertCircle size={16} />
                  <div>
                    <strong>Live risks from Hindsight</strong>
                    <p>{liveBrief.risks.join(" · ")}</p>
                  </div>
                </div>
              )}
              <button className="memory-link">
                <BrainCircuit size={16} />
                Explore account memory <ArrowUpRight size={15} />
              </button>
            </section>

            <section className="panel ask-panel">
              <div className="ask-orb">
                <Sparkles size={22} />
              </div>
              <div>
                <span className="panel-kicker">ASK THE DEAL BRAIN</span>
                <h2>What do you need to know?</h2>
                <p>DealMind retrieves the evidence behind every answer.</p>
              </div>
              <form onSubmit={submitQuestion} className="ask-form">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="e.g. What could stall this deal?"
                  aria-label="Ask about this deal"
                />
                <button type="submit" aria-label="Ask DealMind" disabled={asking}>
                  <Send size={17} />
                </button>
              </form>
              {liveBrief?.answer && (
                <div className="answer-preview">
                  <Sparkles size={14} />
                  <p>{liveBrief.answer}</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      {isSignalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="signal-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signal-title"
          >
            <button
              className="close-button"
              onClick={() => setIsSignalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="modal-icon">
              <Zap size={20} />
            </div>
            <span className="panel-kicker">TEACH DEALMIND</span>
            <h2 id="signal-title">Log a deal signal</h2>
            <p>
              Add a buyer quote, meeting outcome, risk, or commitment. Hindsight will retain it
              under <strong>{selectedDeal.account}</strong> only.
            </p>
            <form onSubmit={saveSignal}>
              <textarea
                value={signal}
                onChange={(event) => setSignal(event.target.value)}
                placeholder="Maya said the CFO can approve budget if security signs off this week…"
                autoFocus
              />
              <button
                className="primary-button full-width"
                type="submit"
                disabled={signalState === "saving"}
              >
                {signalState === "saving" ? "Saving to Hindsight…" : "Save signal"}
                <ArrowUpRight size={16} />
              </button>
            </form>
            {signalState === "saved" && (
              <p className="save-message success">
                <CheckCircle2 size={16} />
                Saved to persistent Hindsight memory.
              </p>
            )}
            {signalState === "demo" && (
              <p className="save-message warning">
                <AlertCircle size={16} />
                Hindsight is offline, so this signal was not persisted.
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
