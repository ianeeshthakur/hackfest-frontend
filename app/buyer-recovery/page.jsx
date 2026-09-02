"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/command-center/Sidebar";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { RoleGuard } from "@/components/ui/RoleGuard";
import {
  BUYER_RECOVERY_OPTIONS,
  BUYER_RECOVERY_CONTEXT,
} from "@/lib/buyerData";
import {
  Clock,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Map,
  AlertTriangle,
} from "lucide-react";

const COLOR = {
  red: {
    card:       "border-red-200 hover:border-red-300",
    selected:   "border-red-400 ring-1 ring-red-300",
    badge:      "bg-red-50 text-red-700 border-red-200",
    delay:      "text-red-600",
    bar:        "bg-red-400",
    why:        "border-red-100 bg-red-50/40",
    whyBtn:     "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
  },
  amber: {
    card:       "border-amber-200 hover:border-amber-300",
    selected:   "border-amber-400 ring-1 ring-amber-200",
    badge:      "bg-amber-50 text-amber-700 border-amber-200",
    delay:      "text-amber-600",
    bar:        "bg-amber-400",
    why:        "border-amber-100 bg-amber-50/40",
    whyBtn:     "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100",
  },
  emerald: {
    card:       "border-emerald-200 hover:border-emerald-300",
    selected:   "border-emerald-400 ring-1 ring-emerald-300 shadow-emerald-100",
    badge:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    delay:      "text-emerald-600",
    bar:        "bg-emerald-500",
    why:        "border-emerald-100 bg-emerald-50/40",
    whyBtn:     "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
  },
};

export default function BuyerRecovery() {
  const [selected, setSelected] = useState("reroute");
  const [openWhy, setOpenWhy] = useState({ reroute: true });

  const toggleWhy = (id) =>
    setOpenWhy((prev) => ({ ...prev, [id]: !prev[id] }));

  const ctx = BUYER_RECOVERY_CONTEXT;
  const selectedOption = BUYER_RECOVERY_OPTIONS.find((o) => o.id === selected);

  return (
    <RoleGuard allowedRole="buyer">
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-body">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-[1100px] mx-auto space-y-8">

          {/* Header */}
          <header>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Buyer-Secured View</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Recovery Options</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Your order <span className="font-bold text-slate-700">{ctx.orderId}</span> — {ctx.product}, {ctx.quantity} —
                  is affected by a supply chain disruption. Please review and select your preferred recovery path.
                </p>
              </div>
              {/* Deadline alert */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-medium text-amber-700 shrink-0">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Original deadline: <span className="font-bold">{ctx.originalDeadline}</span>
              </div>
            </div>

            {/* Selected option summary bar */}
            {selectedOption && (
              <div className="mt-5 px-5 py-3 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center gap-3 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-600">
                  Selected: <span className="font-bold text-slate-900">{selectedOption.name}</span>
                  {" "}— Delay <span className="font-bold">{selectedOption.delay}</span>,
                  Cost <span className="font-bold">{selectedOption.costImpact}</span>,
                  Risk <span className="font-bold">{selectedOption.risk}/100</span>
                </span>
                <Link
                  href="/cluster-map"
                  className="ml-auto flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  <Map className="h-3.5 w-3.5" />
                  Proceed to Accept / Reject
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </header>

          {/* Option Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {BUYER_RECOVERY_OPTIONS.map((opt) => {
              const c = COLOR[opt.color];
              const isSelected = selected === opt.id;
              const whyOpen = openWhy[opt.id];

              return (
                <div
                  key={opt.id}
                  className={`relative bg-white border-2 rounded-2xl overflow-hidden shadow-sm transition-all duration-200
                    ${isSelected ? `${c.selected} shadow-md` : `${c.card}`}
                  `}
                >
                  {/* AI Recommended badge */}
                  {opt.recommended && (
                    <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
                  )}
                  {opt.recommended && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      AI RECOMMENDED
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="px-5 pt-5 pb-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{opt.label}</div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">{opt.name}</div>
                    <p className="text-sm text-slate-500 leading-relaxed">{opt.description}</p>
                  </div>

                  {/* Metrics */}
                  <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                    {/* Delay */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <Clock className="h-3 w-3" /> Delay
                      </div>
                      <div className={`text-base font-bold ${c.delay}`}>{opt.delay}</div>
                    </div>

                    {/* Cost */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cost Impact</div>
                      <div className="text-base font-bold text-slate-700">{opt.costImpact}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.costLabel}</div>
                    </div>

                    {/* Risk */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Fulfillment Risk</div>
                      <div className="flex items-center gap-3">
                        <ExplainableRiskScore score={opt.risk} type="Order" />
                        <div className="flex-1">
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${c.bar}`}
                              style={{ width: `${opt.risk}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{opt.confidence}% conf.</span>
                      </div>
                    </div>
                  </div>

                  {/* Why This Option — Expandable */}
                  <div className="border-t border-slate-100">
                    <button
                      onClick={() => toggleWhy(opt.id)}
                      className={`w-full px-5 py-3 flex items-center justify-between text-xs font-bold transition-colors border-b border-transparent ${c.whyBtn}`}
                    >
                      <span>WHY THIS OPTION?</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${whyOpen ? "rotate-180" : ""}`} />
                    </button>

                    <div className={`grid transition-all duration-300 ease-in-out ${whyOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className={`mx-4 my-3 p-4 rounded-xl border ${c.why}`}>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Factors in your favour</div>
                          <ul className="space-y-1.5 mb-3">
                            {opt.whyThisOption.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                {point}
                              </li>
                            ))}
                          </ul>
                          {opt.tradeoffs.length > 0 && (
                            <>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Trade-offs</div>
                              <ul className="space-y-1.5">
                                {opt.tradeoffs.map((t, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                                    <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="p-4 pt-2">
                    <button
                      onClick={() => setSelected(opt.id)}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isSelected
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isSelected ? "✓ Selected" : "Select this option"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Comparison</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Metric</th>
                    {BUYER_RECOVERY_OPTIONS.map((o) => (
                      <th key={o.id} className={`px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider ${selected === o.id ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`}>
                        {o.name}
                        {o.recommended && <span className="block text-[9px] text-emerald-500 normal-case font-bold">AI Recommended</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Expected Delay", fn: (o) => <span className={`font-bold ${o.delaySortVal === 9 ? 'text-red-500' : o.delaySortVal === 4 ? 'text-amber-500' : 'text-emerald-600'}`}>{o.delay}</span> },
                    { label: "Cost Impact",    fn: (o) => <span className="font-bold text-slate-700">{o.costImpact}</span> },
                    { label: "Risk Score",     fn: (o) => <span className={`font-bold text-lg ${o.risk > 50 ? 'text-red-500' : o.risk > 30 ? 'text-amber-500' : 'text-emerald-600'}`}>{o.risk}<span className="text-slate-400 text-sm font-normal">/100</span></span> },
                    { label: "AI Confidence",  fn: (o) => <span className="font-bold text-slate-600">{o.confidence}%</span> },
                  ].map((row, idx) => (
                    <tr key={row.label} className={`border-b border-slate-100 ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                      <td className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{row.label}</td>
                      {BUYER_RECOVERY_OPTIONS.map((o) => (
                        <td key={o.id} className={`px-6 py-3 text-center ${selected === o.id ? 'bg-slate-50' : ''}`}>
                          {row.fn(o)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="text-sm font-bold text-slate-800">
                  Proceeding with: <span className="text-slate-900">{selectedOption?.name}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Your selection will be reviewed by the supplier team. Head to the map to formally accept or reject.
                </div>
              </div>
              <Link
                href="/cluster-map"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md whitespace-nowrap shrink-0"
              >
                <Map className="h-4 w-4" />
                Accept / Reject on Cluster Map
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
    </RoleGuard>
  );
}