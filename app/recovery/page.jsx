"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { Sparkles, Clock, DollarSign, ShieldAlert, CheckCircle2, ArrowRight, BarChart3, Map } from "lucide-react";
import Link from "next/link";

const SCENARIOS = [
  {
    id: "wait",
    label: "OPTION A",
    name: "WAIT",
    description: "Hold current orders until factory is back online. No additional cost, maximum delay.",
    delay: "+9h",
    delaySortVal: 9,
    cost: "₹0",
    costSortVal: 0,
    risk: 72,
    confidence: 91,
    recommended: false,
    color: "red",
    factors: [
      "No rerouting cost",
      "Factory estimated to recover in 9h",
      "High deadline miss probability for TX-2048",
    ],
    downsides: [
      "Highest delay (+9h)",
      "Risk remains at 72 — above acceptable threshold",
      "Customer SLA likely breached",
    ]
  },
  {
    id: "split",
    label: "OPTION B",
    name: "SPLIT",
    description: "Split TX-2048 order across two alternative suppliers in the Ludhiana Cluster.",
    delay: "+4h",
    delaySortVal: 4,
    cost: "+₹6,500",
    costSortVal: 6500,
    risk: 39,
    confidence: 86,
    recommended: false,
    color: "amber",
    factors: [
      "Splits risk across two suppliers",
      "Moderate cost increase",
      "Reduces delay by 5h vs. WAIT",
    ],
    downsides: [
      "Coordination overhead for split order",
      "Slight certification mismatch on Supplier B",
    ]
  },
  {
    id: "reroute",
    label: "OPTION C",
    name: "REROUTE",
    description: "Reroute full order TX-2048 to F-X7K92 (Surat Cluster, GOTS certified). Optimal balance of cost and speed.",
    delay: "+2h",
    delaySortVal: 2,
    cost: "+₹18,500",
    costSortVal: 18500,
    risk: 24,
    confidence: 88,
    recommended: true,
    color: "emerald",
    factors: [
      "Lowest risk (24) and delay (+2h)",
      "Full GOTS certification match",
      "F-X7K92 has 100% available capacity",
      "Within auto-approval cost threshold",
    ],
    downsides: [
      "Highest cost (+₹18,500)",
    ]
  }
];

const COLOR_MAP = {
  red: {
    border: "border-red-800/40",
    selectedBorder: "border-red-500/60 ring-1 ring-red-500/20",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    glow: "shadow-red-900/10",
    bar: "bg-red-500",
    highlight: "bg-red-500/5"
  },
  amber: {
    border: "border-amber-800/30",
    selectedBorder: "border-amber-500/60 ring-1 ring-amber-500/20",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "shadow-amber-900/10",
    bar: "bg-amber-500",
    highlight: "bg-amber-500/5"
  },
  emerald: {
    border: "border-emerald-700/40",
    selectedBorder: "border-emerald-400/60 ring-1 ring-emerald-400/20",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "shadow-emerald-900/20",
    bar: "bg-emerald-500",
    highlight: "bg-emerald-500/5"
  }
};

const COMPARISON_ROWS = [
  { label: "Delay", key: "delay" },
  { label: "Cost", key: "cost" },
  { label: "Risk", key: "risk" },
  { label: "Confidence", key: "confidence", suffix: "%" },
];

export default function RecoveryScenarios() {
  const [selected, setSelected] = useState("reroute"); // AI-recommended default

  const selectedScenario = SCENARIOS.find(s => s.id === selected);

  return (
    <div className="flex h-screen bg-[#06090F] text-slate-100 overflow-hidden font-body">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-[1200px] mx-auto space-y-8">

          {/* Header */}
          <header>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                  <BarChart3 className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Recovery Scenarios</h1>
                  <p className="text-slate-500 text-sm mt-0.5">AI-generated options for Case TL-4821 — Order TX-2048</p>
                </div>
              </div>
              {selected && (
                <Link
                  href="/cluster-map"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
                >
                  <Map className="h-4 w-4" />
                  Go to Cluster Map to Accept / Reject
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Selected scenario banner */}
            {selectedScenario && (
              <div className="mt-4 px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">
                  Selected scenario: <span className="text-white font-bold">{selectedScenario.name}</span>
                  {" "}— Risk <span className="text-white font-bold">{selectedScenario.risk}</span>, Delay <span className="text-white font-bold">{selectedScenario.delay}</span>, Cost <span className="text-white font-bold">{selectedScenario.cost}</span>
                </span>
                <span className="ml-auto text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Proceed to Cluster Map to submit approval →
                </span>
              </div>
            )}
          </header>

          {/* Option Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {SCENARIOS.map((scenario) => {
              const c = COLOR_MAP[scenario.color];
              const isSelected = selected === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => setSelected(scenario.id)}
                  className={`relative text-left bg-[#0B101A] border rounded-2xl p-6 transition-all duration-200 cursor-pointer group
                    ${isSelected ? `${c.selectedBorder} shadow-xl ${c.glow}` : `${c.border} hover:border-opacity-60 hover:shadow-lg`}
                  `}
                >
                  {/* Recommended badge */}
                  {scenario.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-emerald-900/50">
                      <Sparkles className="h-3 w-3" />
                      AI Recommended
                    </div>
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                  )}

                  {/* Label & Name */}
                  <div className="mb-5 mt-2">
                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{scenario.label}</div>
                    <div className={`text-2xl font-extrabold tracking-tight ${isSelected ? `text-white` : 'text-slate-300'}`}>
                      {scenario.name}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{scenario.description}</p>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className={`p-3 rounded-xl border ${c.border} ${isSelected ? c.highlight : 'bg-slate-900/50'}`}>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase mb-1">
                        <Clock className="h-3 w-3" /> Delay
                      </div>
                      <div className={`text-base font-bold ${scenario.color === 'emerald' ? 'text-emerald-400' : scenario.color === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>
                        {scenario.delay}
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${c.border} ${isSelected ? c.highlight : 'bg-slate-900/50'}`}>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase mb-1">
                        <DollarSign className="h-3 w-3" /> Cost
                      </div>
                      <div className="text-base font-bold text-slate-300">{scenario.cost}</div>
                    </div>
                    <div className={`p-3 rounded-xl border ${c.border} col-span-2 ${isSelected ? c.highlight : 'bg-slate-900/50'}`}>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase mb-2">
                        <ShieldAlert className="h-3 w-3" /> Risk Score
                      </div>
                      <div className="flex items-center gap-4">
                        <ExplainableRiskScore score={scenario.risk} type={scenario.name} />
                        <div className="flex-1">
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${c.bar}`}
                              style={{ width: `${scenario.risk}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-500">{scenario.confidence}% conf.</span>
                      </div>
                    </div>
                  </div>

                  {/* Factors */}
                  <div className="border-t border-slate-800 pt-4 space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Factors For</div>
                      <ul className="space-y-1">
                        {scenario.factors.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                            <span className="text-emerald-500 mt-0.5">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {scenario.downsides.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Downsides</div>
                        <ul className="space-y-1">
                          {scenario.downsides.map((d, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                              <span className="text-red-500 mt-0.5">•</span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Side-by-Side Comparison</h2>
            <div className="bg-[#0B101A] border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32">Metric</th>
                    {SCENARIOS.map((s) => {
                      const isActive = selected === s.id;
                      return (
                        <th key={s.id} className={`px-6 py-4 text-center transition-colors ${isActive ? 'bg-slate-800/60' : ''}`}>
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-base font-extrabold tracking-tight ${
                              isActive ? 'text-white' : 'text-slate-400'
                            }`}>{s.name}</span>
                            {s.recommended && (
                              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="h-2.5 w-2.5" /> Recommended
                              </span>
                            )}
                            {isActive && !s.recommended && (
                              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Selected</span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Delay", render: (s) => (
                      <span className={`font-bold ${s.delaySortVal === 9 ? 'text-red-400' : s.delaySortVal === 4 ? 'text-amber-400' : 'text-emerald-400'}`}>{s.delay}</span>
                    )},
                    { label: "Cost", render: (s) => (
                      <span className={`font-bold ${s.costSortVal === 0 ? 'text-emerald-400' : s.costSortVal === 6500 ? 'text-amber-400' : 'text-red-400'}`}>{s.cost}</span>
                    )},
                    { label: "Risk Score", render: (s) => (
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-lg font-extrabold ${s.risk > 50 ? 'text-red-400' : s.risk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>{s.risk}</span>
                        <div className="w-16 bg-slate-800 rounded-full h-1 overflow-hidden">
                          <div className={`h-full rounded-full ${s.risk > 50 ? 'bg-red-500' : s.risk > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${s.risk}%` }} />
                        </div>
                      </div>
                    )},
                    { label: "Confidence", render: (s) => (
                      <span className="font-bold text-slate-300">{s.confidence}%</span>
                    )},
                  ].map((row, idx) => (
                    <tr key={row.label} className={`border-b border-slate-800/50 ${idx % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{row.label}</td>
                      {SCENARIOS.map((s) => {
                        const isActive = selected === s.id;
                        return (
                          <td key={s.id} className={`px-6 py-4 text-center transition-colors ${isActive ? 'bg-slate-800/40' : ''}`}>
                            {row.render(s)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Action row */}
                  <tr>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</td>
                    {SCENARIOS.map((s) => (
                      <td key={s.id} className={`px-6 py-4 text-center ${selected === s.id ? 'bg-slate-800/40' : ''}`}>
                        <button
                          onClick={() => setSelected(s.id)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selected === s.id
                              ? 'bg-white text-slate-900'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {selected === s.id ? 'Selected ✓' : 'Select'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA to Accept/Reject */}
          <div className="pb-8">
            <div className="bg-gradient-to-r from-slate-900 to-[#0B101A] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-300">Ready to proceed with <span className="text-white">{selectedScenario?.name}</span>?</div>
                <div className="text-xs text-slate-500 mt-1">
                  Head to the Cluster Map to accept or reject the recovery. The factory owner will be notified immediately.
                </div>
              </div>
              <Link
                href="/cluster-map"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-emerald-900/30 whitespace-nowrap shrink-0"
              >
                Accept / Reject on Cluster Map
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
