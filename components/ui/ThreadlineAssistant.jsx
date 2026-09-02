"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRole } from "@/lib/roleContext";
import { useDisruption } from "@/lib/disruptionContext";
import { X, Send, Mic, Square, ChevronDown, Sparkles, Shield, Factory, User, ArrowRight, Activity, Clock, Package, AlertTriangle, Info } from "lucide-react";
import { parseIntentAndParams, simulateScenario } from "@/lib/scenarioEngine";

// ─────────────────────────────────────────────────────────────────────────────
// ROLE-AWARE KNOWLEDGE BASE
// CRITICAL: Buyer NEVER receives internal cause information
// ─────────────────────────────────────────────────────────────────────────────

const KB = {
  owner: {
    role: "Factory Owner",
    icon: Factory,
    accent: "#6366f1",          // indigo
    accentMuted: "rgba(99,102,241,0.12)",
    accentBorder: "rgba(99,102,241,0.25)",
    greeting: "Hello. I'm ThreadLine AI. I have full operational context on Case TL-4821. How can I help you?",
    chips: [
      "What caused this?",
      "Which orders are affected?",
      "What is the best recovery?",
      "Which supplier should we use?",
    ],
    qa: [
      {
        triggers: ["caused", "why", "reason", "root cause", "happened", "what is the issue"],
        answer: "Grid power interruption in Sector 4 is the confirmed root cause, affecting production across 4 machine lines. IoT sensors report zero output. AI confidence: 94%. Estimated grid restoration: approximately 6 hours.",
      },
      {
        triggers: ["order", "affected", "impact", "which order"],
        answer: "3 orders are currently impacted: TX-2048 (9 hr delay risk), TX-2051 (4 hr delay risk), and TX-2063 (6 hr delay risk). TX-2048 has the highest buyer urgency and should be prioritised for rerouting.",
      },
      {
        triggers: ["best recovery", "recovery", "plan", "option", "scenario", "recommend"],
        answer: "Best recovery path for Case TL-4821: (1) Reroute TX-2048 production to Tiruppur Cluster — 87% capacity available. (2) Engage alternate supplier SuppA-T02. (3) Estimated lead time impact: reduced from 9 hrs to 3 hrs. Recovery Scenarios page has full simulation.",
      },
      {
        triggers: ["supplier", "vendor", "alternate supplier", "which supplier"],
        answer: "Recommended alternate supplier: SuppA-T02 (Tiruppur). It has matching weaving capability, 92% reliability score, and available capacity of 12,000 units/day. SuppA-S07 is a secondary option with slightly lower capacity.",
      },
      {
        triggers: ["confidence", "accurate", "sure", "certain"],
        answer: "Root cause confidence is 94%, corroborated by factory telemetry (99%) and power signal (94%). Weather and market signals are clear, ruling out external economic or climatic factors.",
      },
      {
        triggers: ["logistics", "fleet", "truck", "checkpoint"],
        answer: "Logistics signal shows WARNING status — inbound fleet reporting delays at Checkpoint 3 due to local traffic gridlock. This is a secondary impact, not the primary cause.",
      },
      {
        triggers: ["sector 4", "power", "grid", "electricity"],
        answer: "Grid power interruption in Sector 4 has been confirmed by the power signal at 94% confidence. Estimated restoration time is approximately 6 hours. No weather events contributed to the outage.",
      },
    ],
    fallback: "I have full operational context on Case TL-4821. You can ask about the root cause, affected orders, recovery options, or supplier recommendations.",
  },

  buyer: {
    role: "Buyer",
    icon: User,
    accent: "#0ea5e9",          // sky blue
    accentMuted: "rgba(14,165,233,0.12)",
    accentBorder: "rgba(14,165,233,0.25)",
    greeting: "Hello. I'm ThreadLine AI. I'm here to keep you informed on your order status and available recovery options. How can I help?",
    chips: [
      "How much delay should I expect?",
      "What recovery options are available?",
      "Why is rerouting recommended?",
      "Which option has the lowest risk?",
    ],
    qa: [
      // NOTE: Internal cause (grid power / Sector 4) is NEVER disclosed to buyer
      {
        triggers: ["what happened", "why", "reason", "cause", "issue", "problem", "disruption"],
        answer: "ThreadLine has identified a production disruption affecting your Order TX-2048. We are working to resolve the impact as quickly as possible. The current estimated delay is 9 hours if no recovery action is taken.",
      },
      {
        triggers: ["delay", "how long", "how much", "time", "when", "estimate"],
        answer: "Current estimated delay for Order TX-2048 is 9 hours without intervention. With rerouting, this can be reduced to approximately 3 hours. ThreadLine is actively processing recovery scenarios on your behalf.",
      },
      {
        triggers: ["recovery", "option", "alternative", "scenario", "available"],
        answer: "Two recovery options are available: (1) Partial rerouting — fulfil 60% of order volume with an alternate production facility, 3-hour delay. (2) Full rerouting — complete order transferred, 5-hour delay but highest reliability. ThreadLine recommends Option 1 for speed.",
      },
      {
        triggers: ["rerouting", "why reroute", "recommend", "why is it"],
        answer: "Rerouting is recommended because the alternate facility has 87% available capacity and a matching production capability. This minimises your delay from 9 hours down to approximately 3 hours, protecting your delivery commitment.",
      },
      {
        triggers: ["lowest risk", "safest", "best option", "which option", "most reliable"],
        answer: "Full rerouting (Option 2) carries the lowest risk — 96% fulfilment confidence — as the entire order is handled by a single, fully operational facility. Option 1 is faster but involves split fulfilment.",
      },
      {
        triggers: ["status", "order status", "tx-2048", "my order", "update"],
        answer: "Order TX-2048 status: Production disruption detected. Delay risk: 9 hours (without action). Recovery action: In progress. ThreadLine will notify you when rerouting is confirmed.",
      },
      {
        triggers: ["contact", "speak", "human", "support", "agent"],
        answer: "Your ThreadLine account manager has been alerted to this disruption. You should receive a direct update within 30 minutes. In the meantime, I can answer questions about delay estimates and recovery options.",
      },
    ],
    fallback: "I'm here to help with your order status and recovery options. You can ask about expected delays, available recovery scenarios, or rerouting recommendations.",
  },
};

function getAnswer(role, rawText) {
  const t = rawText.toLowerCase();
  const kb = KB[role];
  for (const item of kb.qa) {
    if (item.triggers.some(trigger => t.includes(trigger))) {
      return item.answer;
    }
  }
  return kb.fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario Card Component
// ─────────────────────────────────────────────────────────────────────────────
function ScenarioCard({ data, config }) {
  if (data.error) {
    return <div style={{ color: "#ef4444", fontSize: 12 }}>{data.error}</div>;
  }

  const { recommendedAction, explanation, assumptions, title, confidence, current, projected } = data;

  const MetricBox = ({ label, icon: Icon, before, after, isPositive }) => (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
        <Icon style={{ width: 10, height: 10 }} /> {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}>
        <span style={{ color: "#94a3b8" }}>{before}</span>
        <ArrowRight style={{ width: 12, height: 12, color: "#64748b" }} />
        <span style={{ color: isPositive ? "#ef4444" : "#4ade80" }}>{after}</span>
      </div>
    </div>
  );

  return (
    <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, overflow: "hidden", marginTop: 4 }}>
      {/* Header */}
      <div style={{ background: "rgba(99,102,241,0.1)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles style={{ width: 14, height: 14, color: "#818cf8" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: "0.05em" }}>{title}</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#4ade80", background: "rgba(74,222,128,0.15)", padding: "2px 6px", borderRadius: 4 }}>
          {confidence} CONFIDENCE
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <MetricBox label="Risk Score" icon={AlertTriangle} before={current.risk} after={projected.risk} isPositive={projected.risk > current.risk} />
        <MetricBox label="Expected Delay" icon={Clock} before={`+${current.delay || 0}h`} after={`+${projected.delay}h`} isPositive={projected.delay > (current.delay || 0)} />
        <MetricBox label="Capacity Impact" icon={Activity} before={`${current.capacityPct}%`} after={`${projected.capacityPct}%`} isPositive={projected.capacityPct < current.capacityPct} />
        <MetricBox label="Orders At Risk" icon={Package} before={current.ordersAtRisk} after={projected.ordersAtRisk} isPositive={projected.ordersAtRisk > current.ordersAtRisk} />
      </div>

      {/* Recommendation */}
      <div style={{ padding: "0 14px" }}>
        <div style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", textTransform: "uppercase" }}>Recommended Action</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#e0e7ff" }}>{recommendedAction}</span>
        </div>
      </div>

      {/* Explanation */}
      <div style={{ padding: "14px", fontSize: 12, lineHeight: 1.6, color: "#cbd5e1" }}>
        {explanation}
      </div>

      {/* Assumptions */}
      <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
          <Info style={{ width: 10, height: 10 }} /> Scenario Assumptions
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 10, color: "#94a3b8" }}>
          {assumptions.map((a, i) => <li key={i} style={{ marginBottom: 2 }}>{a}</li>)}
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ThreadLine Assistant Component
// ─────────────────────────────────────────────────────────────────────────────

export function ThreadlineAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useRole();
  const { activeDisruption } = useDisruption();
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [micState, setMicState] = useState("IDLE"); // IDLE | LISTENING
  const [transcript, setTranscript] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const panelRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && role) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen, role]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Init speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.onresult = (e) => {
      let cur = "";
      for (let i = e.resultIndex; i < e.results.length; i++) cur += e.results[i][0].transcript;
      setTranscript(cur);
    };
    recognitionRef.current.onend = () => {
      setMicState("IDLE");
      if (transcript.trim()) sendMessage(transcript);
    };
    recognitionRef.current.onerror = () => setMicState("IDLE");
  }, [transcript]);

  const selectRole = (r) => {
    setRole(r);
    const kb = KB[r];
    setMessages([{ id: 0, role: "ai", text: kb.greeting }]);
  };

  const sendMessage = (text) => {
    if (!text.trim() || isProcessing || !role) return;
    const userMsg = { id: Date.now(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setTextInput("");
    setTranscript("");
    setIsProcessing(true);
    setTimeout(() => {
      // 1. Check if scenario intent
      const { isScenario, params } = parseIntentAndParams(text);
      if (isScenario) {
        const scenarioData = simulateScenario(activeDisruption, params, role);
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", type: "SCENARIO", data: scenarioData }]);
      } else {
        const answer = getAnswer(role, text);
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", type: "TEXT", text: answer }]);
      }
      setIsProcessing(false);
    }, 700);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(textInput);
  };

  const toggleMic = () => {
    if (micState === "LISTENING") {
      recognitionRef.current?.stop();
      setMicState("IDLE");
    } else {
      setTranscript("");
      setMicState("LISTENING");
      try { recognitionRef.current?.start(); } catch {}
    }
  };

  const reset = () => {
    setRole(null);
    setMessages([]);
    setTextInput("");
    setIsProcessing(false);
    setMicState("IDLE");
  };

  const config = role ? KB[role] : null;

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        id="threadline-assistant-trigger"
        onClick={() => setIsOpen(v => !v)}
        title="ThreadLine AI Assistant"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          borderRadius: "8px",
          background: isOpen ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
          border: `1px solid ${isOpen ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.2)"}`,
          color: "#818cf8",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          cursor: "pointer",
          transition: "all 0.2s",
          width: "100%",
          textTransform: "uppercase",
        }}
      >
        <Sparkles style={{ width: 13, height: 13 }} />
        ThreadLine AI
        <span style={{
          marginLeft: "auto",
          width: 6, height: 6,
          borderRadius: "50%",
          background: "#4ade80",
          boxShadow: "0 0 6px #4ade80",
          flexShrink: 0,
        }} />
      </button>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 3000,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            transition: "opacity 0.2s",
          }}
        />
      )}

      {/* ── Slide-Out Panel ── */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "420px",
          zIndex: 3001,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "linear-gradient(180deg, #0c1220 0%, #0a0f1c 100%)",
          borderRight: "1px solid rgba(99,102,241,0.2)",
          boxShadow: isOpen ? "20px 0 60px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Panel Header */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Sparkles style={{ width: 15, height: 15, color: "#818cf8" }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
                  ThreadLine AI
                </div>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Supply Chain Intelligence
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {role && (
                <button
                  onClick={reset}
                  style={{
                    fontSize: 10, fontWeight: 600, color: "#64748b",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6, padding: "4px 8px", cursor: "pointer", letterSpacing: "0.04em",
                  }}
                >
                  Switch Role
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#64748b", cursor: "pointer",
                }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>

          {/* Active role badge */}
          {role && config && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
              <Shield style={{ width: 11, height: 11, color: config.accent }} />
              <span style={{ fontSize: 10, color: config.accent, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {config.role} View — Role-Filtered Response
              </span>
            </div>
          )}
        </div>


        {/* ── Chat Area ── */}
        {role && config && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                  {msg.role === "ai" && (
                    <div style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: config.accentMuted, border: `1px solid ${config.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
                    }}>
                      <Sparkles style={{ width: 12, height: 12, color: config.accent }} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: msg.type === "SCENARIO" ? "95%" : "78%",
                    width: msg.type === "SCENARIO" ? "100%" : "auto",
                    padding: msg.type === "SCENARIO" ? 0 : "10px 13px",
                    borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                    fontSize: 12.5,
                    lineHeight: 1.65,
                    fontWeight: msg.role === "user" ? 500 : 400,
                    ...(msg.role === "user" ? {
                      background: config.accentMuted,
                      border: `1px solid ${config.accentBorder}`,
                      color: "#c7d2fe",
                    } : msg.type === "SCENARIO" ? {
                      background: "transparent",
                    } : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#cbd5e1",
                    }),
                  }}>
                    {msg.type === "SCENARIO" ? (
                      <ScenarioCard data={msg.data} config={config} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isProcessing && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: config.accentMuted, border: `1px solid ${config.accentBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Sparkles style={{ width: 12, height: 12, color: config.accent }} />
                  </div>
                  <div style={{
                    padding: "10px 14px", borderRadius: "12px 12px 12px 3px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", gap: 5, alignItems: "center",
                  }}>
                    {[0, 150, 300].map(d => (
                      <div key={d} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: config.accent, opacity: 0.7,
                        animation: "threadlineBounce 1s infinite",
                        animationDelay: `${d}ms`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips — show on first message or after scenario */}
            {(messages.length === 1 || messages[messages.length - 1]?.type === "SCENARIO") && (
              <div style={{ padding: "8px 16px 4px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
                {(messages.length === 1 ? config.chips : [
                  "What if we wait?", 
                  "What if we reroute?", 
                  "What if the outage lasts 10 hours?",
                  "What if we split the shipment?"
                ]).map(chip => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    style={{
                      padding: "5px 10px", borderRadius: 7,
                      fontSize: 11, fontWeight: 500, cursor: "pointer",
                      background: config.accentMuted,
                      border: `1px solid ${config.accentBorder}`,
                      color: config.accent,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.75"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.2)",
              flexShrink: 0,
            }}>
              {micState === "LISTENING" && (
                <div style={{
                  marginBottom: 8, padding: "6px 10px", borderRadius: 7,
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: 11, color: "#fca5a5", fontStyle: "italic",
                }}>
                  🎙 {transcript || "Listening..."}
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={toggleMic}
                  style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: 9,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s",
                    background: micState === "LISTENING" ? "rgba(239,68,68,0.15)" : config.accentMuted,
                    border: `1px solid ${micState === "LISTENING" ? "rgba(239,68,68,0.35)" : config.accentBorder}`,
                    color: micState === "LISTENING" ? "#f87171" : config.accent,
                  }}
                  title={micState === "LISTENING" ? "Stop listening" : "Speak"}
                >
                  {micState === "LISTENING"
                    ? <Square style={{ width: 13, height: 13 }} />
                    : <Mic style={{ width: 15, height: 15 }} />
                  }
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Ask ThreadLine AI…`}
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  disabled={micState === "LISTENING" || isProcessing}
                  style={{
                    flex: 1, padding: "9px 13px", borderRadius: "9px 0 0 9px",
                    fontSize: 12.5, outline: "none",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRight: "none",
                    color: "#e2e8f0",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || isProcessing || micState === "LISTENING"}
                  style={{
                    width: 36, height: 36, borderRadius: "0 9px 9px 0", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.15s",
                    background: config.accentMuted,
                    border: `1px solid ${config.accentBorder}`,
                    borderLeft: "none",
                    color: config.accent,
                    opacity: (!textInput.trim() || isProcessing) ? 0.4 : 1,
                  }}
                >
                  <Send style={{ width: 13, height: 13 }} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes threadlineBounce {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
