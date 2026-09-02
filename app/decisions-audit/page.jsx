"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { useAudit, ACTOR } from "@/lib/auditContext";
import {
  ShieldCheck, Filter, Clock, TrendingDown, TrendingUp,
  Minus, CheckCircle2, AlertCircle, Clock3, Zap,
  Activity, User, Bot, Settings2, ChevronDown, ChevronUp,
} from "lucide-react";

// ─── Actor config ─────────────────────────────────────────────────────────────
const ACTOR_META = {
  SYSTEM:  { label: "SYSTEM",  color: "#94a3b8", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.25)", Icon: Settings2 },
  AI:      { label: "AI",      color: "#818cf8", bg: "rgba(99,102,241,0.1)",   border: "rgba(99,102,241,0.25)",  Icon: Bot       },
  FACTORY: { label: "FACTORY", color: "#fb923c", bg: "rgba(251,146,60,0.1)",   border: "rgba(251,146,60,0.25)",  Icon: Activity  },
  BUYER:   { label: "BUYER",   color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)",  Icon: User      },
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META = {
  CONFIRMED: { color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.25)" },
  COMPLETED: { color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)"  },
  PENDING:   { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.25)"  },
  APPROVED:  { color: "#818cf8", bg: "rgba(99,102,241,0.1)",   border: "rgba(99,102,241,0.25)"  },
  ACTIVE:    { color: "#38bdf8", bg: "rgba(56,189,248,0.1)",   border: "rgba(56,189,248,0.25)"  },
  LOGGED:    { color: "#94a3b8", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.25)" },
};

const FILTERS = ["ALL", "AI", "SYSTEM", "FACTORY", "BUYER"];

// ─── Risk delta component ─────────────────────────────────────────────────────
function RiskDelta({ before, after }) {
  if (before == null || after == null) return <span style={{ color: "#475569", fontSize: 11 }}>—</span>;
  const delta = after - before;
  const improved = delta < 0;
  const unchanged = delta === 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "monospace", color: unchanged ? "#64748b" : improved ? "#34d399" : "#f87171" }}>
        {before}
      </span>
      <span style={{ color: "#475569", fontSize: 10 }}>→</span>
      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: unchanged ? "#64748b" : improved ? "#34d399" : "#f87171" }}>
        {after}
      </span>
      {!unchanged && (
        improved
          ? <TrendingDown style={{ width: 12, height: 12, color: "#34d399" }} />
          : <TrendingUp style={{ width: 12, height: 12, color: "#f87171" }} />
      )}
      {unchanged && <Minus style={{ width: 10, height: 10, color: "#475569" }} />}
    </div>
  );
}

// ─── Single audit entry ───────────────────────────────────────────────────────
function AuditEntry({ entry, index, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const actor = ACTOR_META[entry.actor] || ACTOR_META.SYSTEM;
  const status = STATUS_META[entry.status] || STATUS_META.LOGGED;
  const ActorIcon = actor.Icon;

  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }}>
      {/* Timeline spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
        {/* Dot */}
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0, zIndex: 1,
          background: actor.bg, border: `1.5px solid ${actor.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 12px ${actor.bg}`,
        }}>
          <ActorIcon style={{ width: 14, height: 14, color: actor.color }} />
        </div>
        {/* Connector line */}
        {!isLast && (
          <div style={{
            flex: 1, width: 1, minHeight: 28,
            background: "linear-gradient(to bottom, rgba(99,102,241,0.15), rgba(99,102,241,0.03))",
            marginTop: 4,
          }} />
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, marginLeft: 12, marginBottom: isLast ? 0 : 16 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
        >
          {/* Header row */}
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              width: "100%", textAlign: "left", padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer", background: "transparent", border: "none",
            }}
          >
            {/* Time */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, minWidth: 52 }}>
              <Clock3 style={{ width: 11, height: 11, color: "#475569" }} />
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b", fontWeight: 600 }}>{entry.time}</span>
            </div>

            {/* Action */}
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{entry.action}</span>

            {/* Actor badge */}
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
              padding: "2px 7px", borderRadius: 4,
              background: actor.bg, border: `1px solid ${actor.border}`, color: actor.color,
              flexShrink: 0,
            }}>
              {actor.label}
            </span>

            {/* Status badge */}
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
              padding: "2px 7px", borderRadius: 4,
              background: status.bg, border: `1px solid ${status.border}`, color: status.color,
              flexShrink: 0,
            }}>
              {entry.status}
            </span>

            {/* Expand chevron */}
            {expanded
              ? <ChevronUp style={{ width: 14, height: 14, color: "#475569", flexShrink: 0 }} />
              : <ChevronDown style={{ width: 14, height: 14, color: "#475569", flexShrink: 0 }} />
            }
          </button>

          {/* Expanded detail */}
          {expanded && (
            <div style={{
              padding: "0 14px 14px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10,
            }}>
              {/* Reason */}
              <div style={{ gridColumn: "1 / -1", marginTop: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Reason</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{entry.reason || "—"}</div>
              </div>

              {/* Risk Before */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Risk Before</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#e2e8f0" }}>
                  {entry.riskBefore != null ? `${entry.riskBefore}` : "—"}
                </div>
              </div>

              {/* Risk After */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Risk After</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "#e2e8f0" }}>
                  {entry.riskAfter != null ? `${entry.riskAfter}` : "—"}
                </div>
              </div>

              {/* Delta */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Delta</div>
                <RiskDelta before={entry.riskBefore} after={entry.riskAfter} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DecisionsAuditPage() {
  const { entries } = useAudit();
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered = activeFilter === "ALL"
    ? entries
    : entries.filter(e => e.actor === activeFilter);

  // Stats
  const totalRiskReduction = entries.reduce((acc, e) => {
    if (e.riskBefore != null && e.riskAfter != null) return acc + (e.riskBefore - e.riskAfter);
    return acc;
  }, 0);
  const aiActions    = entries.filter(e => e.actor === ACTOR.AI).length;
  const buyerActions = entries.filter(e => e.actor === ACTOR.BUYER).length;
  const pending      = entries.filter(e => e.status === "PENDING").length;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#06090F", color: "#f1f5f9", overflow: "hidden", fontFamily: "var(--font-body)" }}>
      <Sidebar />

      <main style={{ flex: 1, overflowY: "auto", padding: "40px 40px 60px" }}>
        {/* Background grid */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <header style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h1 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                  <span style={{
                    padding: "6px 8px", background: "rgba(99,102,241,0.1)", borderRadius: 8,
                    border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8",
                    display: "flex", alignItems: "center",
                  }}>
                    <ShieldCheck style={{ width: 18, height: 18 }} />
                  </span>
                  Decisions & Audit
                </h1>
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 6, marginBottom: 0 }}>
                  Immutable log of all system, AI, and human decisions — Case TL-4821
                </p>
              </div>
              <div style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 600,
                background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
                color: "#4ade80", letterSpacing: "0.06em",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
                LIVE AUDIT LOG
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { label: "Total Events",    value: entries.length,     color: "#818cf8" },
                { label: "AI Actions",      value: aiActions,          color: "#818cf8" },
                { label: "Buyer Decisions", value: buyerActions,       color: "#34d399" },
                { label: "Risk Reduced",    value: `−${totalRiskReduction}`, color: "#34d399" },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Pending banner */}
            {pending > 0 && (
              <div style={{
                marginTop: 12, padding: "10px 14px", borderRadius: 8,
                background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <AlertCircle style={{ width: 14, height: 14, color: "#fbbf24" }} />
                <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>
                  {pending} decision{pending > 1 ? "s" : ""} awaiting action
                </span>
              </div>
            )}
          </header>

          {/* ── Filters ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Filter style={{ width: 13, height: 13, color: "#475569" }} />
            <span style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Filter</span>
            {FILTERS.map(f => {
              const meta = f !== "ALL" ? ACTOR_META[f] : null;
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s",
                    background: isActive ? (meta ? meta.bg : "rgba(99,102,241,0.15)") : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? (meta ? meta.border : "rgba(99,102,241,0.35)") : "rgba(255,255,255,0.07)"}`,
                    color: isActive ? (meta ? meta.color : "#818cf8") : "#64748b",
                  }}
                >
                  {f}
                  <span style={{ marginLeft: 5, opacity: 0.6 }}>
                    ({f === "ALL" ? entries.length : entries.filter(e => e.actor === f).length})
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Timeline ── */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#475569", fontSize: 13 }}>
                No entries for this filter.
              </div>
            ) : (
              filtered.map((entry, index) => (
                <AuditEntry
                  key={entry.id}
                  entry={entry}
                  index={index}
                  isLast={index === filtered.length - 1}
                />
              ))
            )}
          </div>

          {/* Live footer */}
          <div style={{
            marginTop: 32, paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Activity style={{ width: 12, height: 12, color: "#475569" }} />
            <span style={{ fontSize: 11, color: "#475569" }}>
              Timeline updates automatically as actions occur across the application.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
