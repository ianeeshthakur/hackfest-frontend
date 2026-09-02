"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Send, Zap, Volume2, ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────
// Investigation-aware intent parser
// ─────────────────────────────────────────────
const INVESTIGATION_CONTEXT = {
  caseId: "TL-4821",
  rootCause: "Grid power interruption affecting Sector 4.",
  confidence: 94,
  signals: [
    { source: "FACTORY TELEMETRY", status: "CRITICAL",    confidence: 99, finding: "Machine downtime spiked across 4 lines. IoT sensors report zero output." },
    { source: "POWER SIGNAL",      status: "CONFIRMED",   confidence: 94, finding: "Grid power interruption detected in affected industrial region (Sector 4)." },
    { source: "SUPPLIER SIGNAL",   status: "UNREACHABLE", confidence: 85, finding: "Automated ping to supplier ERP timed out. Local network likely down." },
    { source: "WEATHER SIGNAL",    status: "CLEAR",       confidence: 98, finding: "No severe weather events in the region. Disruption isolated to infrastructure." },
    { source: "LOGISTICS SIGNAL",  status: "WARNING",     confidence: 76, finding: "Inbound fleet reporting delays at checkpoint 3 due to local traffic gridlock." },
    { source: "MARKET SIGNAL",     status: "NOMINAL",     confidence: 91, finding: "No broader market shocks or raw material price spikes detected." },
  ],
  infoGaps: [
    { label: "Supplier Recovery Schedule", status: "UNVERIFIED" },
    { label: "Alternate Capacity",          status: "PENDING" },
    { label: "Pickup Slot",                  status: "PENDING" },
  ],
};

function parseInvestigationIntent(rawText) {
  const t = rawText.toLowerCase();
  const ctx = INVESTIGATION_CONTEXT;

  if (t.includes("root cause") || t.includes("what happened") || t.includes("why") || t.includes("reason"))
    return `Root cause identified with ${ctx.confidence}% AI confidence: "${ctx.rootCause}" Power signals and factory telemetry corroborate this finding.`;

  if (t.includes("confidence") || t.includes("sure") || t.includes("certain") || t.includes("accurate"))
    return `Overall AI confidence for Case ${ctx.caseId} is ${ctx.confidence}%. Power and factory telemetry align at 94–99%, making the synthesis highly reliable.`;

  if (t.includes("critical") || t.includes("factory telemetry") || t.includes("machine") || t.includes("downtime")) {
    const s = ctx.signals.find(s => s.status === "CRITICAL");
    return `Critical signal — ${s.source}: ${s.finding} (${s.confidence}% confidence).`;
  }

  if (t.includes("power") || t.includes("electricity") || t.includes("grid") || t.includes("sector 4")) {
    const s = ctx.signals.find(s => s.source === "POWER SIGNAL");
    return `Power Signal (${s.confidence}% conf, ${s.status}): ${s.finding}`;
  }

  if (t.includes("supplier") || t.includes("erp") || t.includes("vendor")) {
    const s = ctx.signals.find(s => s.source === "SUPPLIER SIGNAL");
    return `Supplier Signal (${s.confidence}% conf, ${s.status}): ${s.finding} Recovery schedule is currently UNVERIFIED.`;
  }

  if (t.includes("weather") || t.includes("natural") || t.includes("storm") || t.includes("rain")) {
    const s = ctx.signals.find(s => s.source === "WEATHER SIGNAL");
    return `Weather Signal (${s.confidence}% conf, ${s.status}): ${s.finding} The disruption is infrastructure-related, not weather.`;
  }

  if (t.includes("logistics") || t.includes("fleet") || t.includes("truck") || t.includes("delivery") || t.includes("checkpoint")) {
    const s = ctx.signals.find(s => s.source === "LOGISTICS SIGNAL");
    return `Logistics Signal (${s.confidence}% conf, ${s.status}): ${s.finding}`;
  }

  if (t.includes("market") || t.includes("price") || t.includes("shock") || t.includes("commodity")) {
    const s = ctx.signals.find(s => s.source === "MARKET SIGNAL");
    return `Market Signal (${s.confidence}% conf, ${s.status}): ${s.finding} No economic amplifiers detected.`;
  }

  if (t.includes("gap") || t.includes("missing") || t.includes("unknown") || t.includes("pending") || t.includes("unverified")) {
    const gaps = ctx.infoGaps.map(g => `${g.label} (${g.status})`).join(", ");
    return `${ctx.infoGaps.length} information gaps remain: ${gaps}. Resolving these is critical for recovery planning.`;
  }

  if (t.includes("alternative") || t.includes("backup") || t.includes("recovery") || t.includes("capacity") || t.includes("pickup"))
    return `Alternate capacity and pickup slot are PENDING. Supplier recovery schedule is UNVERIFIED. Resolve these gaps to unlock recovery scenario planning.`;

  if (t.includes("summary") || t.includes("brief") || t.includes("overview") || t.includes("status"))
    return `Case ${ctx.caseId} — Investigation complete. Root cause: ${ctx.rootCause} AI confidence: ${ctx.confidence}%. ${ctx.infoGaps.length} information gaps remain.`;

  if (t.includes("how many signal") || t.includes("signals") || t.includes("sources")) {
    const critCount = ctx.signals.filter(s => s.status === "CRITICAL" || s.status === "CONFIRMED").length;
    return `${ctx.signals.length} signal sources analyzed: factory telemetry, power, supplier, weather, logistics, and market. ${critCount} are critical or confirmed.`;
  }

  if (t.includes("next") || t.includes("action") || t.includes("what should") || t.includes("recommend"))
    return `Recommended next steps for Case ${ctx.caseId}: (1) Verify supplier recovery schedule, (2) Identify alternate capacity in adjacent clusters, (3) Confirm pickup slot. Navigate to Recovery Scenarios for options.`;

  if (t.includes("case") || t.includes("id") || t.includes("tl"))
    return `This is Case TL-4821. Investigation complete with ${ctx.confidence}% confidence. Root cause: ${ctx.rootCause}`;

  return `I have full context on Case ${ctx.caseId}. Ask me about the root cause, signal telemetry (factory, power, supplier, weather, logistics, market), AI confidence, information gaps, or next steps.`;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export function InvestigationCopilot() {
  const [state, setState] = useState("IDLE");
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, state]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
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
        if (state === "LISTENING") processText(transcript);
      };

      recognitionRef.current.onerror = (e) => {
        if (e.error !== "no-speech") {
          setState("ERROR");
          setResponseText("Microphone error or permission denied.");
        } else setState("IDLE");
      };
    }
    synthRef.current = window.speechSynthesis;
  }, [transcript, state]);

  const processText = (text) => {
    if (!text.trim()) { setState("IDLE"); return; }
    setState("PROCESSING");
    setMessages(prev => [...prev, { role: "user", text }]);
    setTimeout(() => {
      const reply = parseInvestigationIntent(text);
      setResponseText(reply);
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      setState("RESPONDING");
      if (synthRef.current) {
        synthRef.current.cancel();
        const utt = new SpeechSynthesisUtterance(reply);
        utt.rate = 0.95;
        utt.onend = () => setTimeout(() => setState("IDLE"), 1500);
        synthRef.current.speak(utt);
      }
    }, 650);
  };

  const toggleListening = () => {
    if (state === "LISTENING") {
      recognitionRef.current?.stop();
      setState("PROCESSING");
    } else if (state === "RESPONDING" || state === "PROCESSING") {
      synthRef.current?.cancel();
      recognitionRef.current?.stop();
      setState("IDLE");
    } else {
      setTranscript("");
      setState("LISTENING");
      try { recognitionRef.current?.start(); } catch (e) { console.error(e); }
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      processText(textInput);
      setTextInput("");
    }
  };

  const CHIPS = ["Root cause?", "AI confidence?", "Info gaps?", "Next steps?", "Signal count?"];

  return (
    <div className="fixed bottom-8 right-8 z-[2000]" style={{ width: "340px" }}>
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(135deg, #0d1424 0%, #0b101a 100%)",
          border: "1px solid rgba(99,102,241,0.25)",
          boxShadow: "0 0 40px rgba(99,102,241,0.08), 0 25px 50px rgba(0,0,0,0.55)",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center justify-between cursor-pointer select-none"
          style={{
            background: "linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)",
            borderBottom: "1px solid rgba(99,102,241,0.2)",
          }}
          onClick={() => setIsMinimized(v => !v)}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
              >
                <Zap className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              {state === "LISTENING" && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </div>
            <div>
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-0.5">
                Investigation Copilot
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Case TL-4821</div>
            </div>
          </div>
          <ChevronDown
            className="h-4 w-4 text-slate-500 transition-transform duration-300"
            style={{ transform: isMinimized ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>

        {/* Collapsible body */}
        <div
          style={{
            maxHeight: isMinimized ? "0px" : "440px",
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
          }}
        >
          {/* Chat */}
          <div
            className="p-3 flex flex-col gap-2.5 overflow-y-auto"
            style={{ minHeight: "150px", maxHeight: "270px" }}
          >
            {messages.length === 0 && state === "IDLE" && (
              <div className="flex flex-col items-center justify-center h-full py-6 gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  <Zap className="h-5 w-5 text-indigo-400" />
                </div>
                <p className="text-slate-500 text-xs text-center leading-relaxed">
                  Ask about signals, root cause,<br />confidence, or next steps
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div
                    className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mr-2 mt-0.5"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                  >
                    <Zap className="h-3 w-3 text-indigo-400" />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#c7d2fe" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#cbd5e1" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {state === "LISTENING" && (
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <Mic className="h-3 w-3 text-red-400" />
                </div>
                <div
                  className="px-3 py-2 rounded-xl text-xs italic"
                  style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", color: "#fca5a5" }}
                >
                  {transcript || "Listening..."}
                </div>
              </div>
            )}

            {state === "PROCESSING" && (
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                >
                  <Zap className="h-3 w-3 text-indigo-400" />
                </div>
                <div
                  className="px-3 py-2 rounded-xl flex items-center gap-1.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[0, 120, 240].map(d => (
                    <div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: "#6366f1", animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {state === "RESPONDING" && (
              <div className="flex items-center gap-1.5 px-1">
                <Volume2 className="h-3 w-3 text-indigo-400 animate-pulse" />
                <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">Speaking</span>
              </div>
            )}

            {state === "ERROR" && (
              <div
                className="text-xs text-red-400 px-3 py-2 rounded-xl"
                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}
              >
                {responseText}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips — only when fresh */}
          {messages.length === 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => processText(chip)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "#a5b4fc",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={toggleListening}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
              style={
                state === "LISTENING"
                  ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }
                  : state === "PROCESSING" || state === "RESPONDING"
                  ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#475569" }
                  : { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }
              }
              title={state === "LISTENING" ? "Stop" : "Speak"}
            >
              {state === "LISTENING"
                ? <Square className="h-3.5 w-3.5" fill="currentColor" />
                : <Mic className="h-4 w-4" />}
            </button>

            <form onSubmit={handleTextSubmit} className="flex-1 flex">
              <input
                type="text"
                placeholder="Ask about this investigation..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={state === "LISTENING"}
                className="flex-1 text-xs px-3 py-2 rounded-l-lg outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "none",
                  color: "#e2e8f0",
                }}
              />
              <button
                type="submit"
                disabled={!textInput.trim() || state === "LISTENING"}
                className="px-3 rounded-r-lg transition-all disabled:opacity-40 hover:brightness-125"
                style={{
                  background: "rgba(99,102,241,0.2)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderLeft: "none",
                  color: "#818cf8",
                }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
