"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import {
  FALSE_DIV_SUMMARY,
  FALSE_DIV_CASES,
} from "@/lib/falseDiversificationData";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  GitMerge,
  ShieldAlert,
  Zap,
  Package,
  Factory,
  Info,
} from "lucide-react";

const SEVERITY_STYLE = {
  CRITICAL: { bg: "bg-red-500/10",    border: "border-red-500/30",    text: "text-red-400",    dot: "bg-red-500"    },
  HIGH:     { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-400",  dot: "bg-amber-500"  },
  MEDIUM:   { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", dot: "bg-yellow-500" },
};

const FACTORY_STATUS_STYLE = {
  DISRUPTED:   { text: "text-red-400",    dot: "bg-red-500"    },
  WARNING:     { text: "text-amber-400",  dot: "bg-amber-500"  },
  OPERATIONAL: { text: "text-emerald-400", dot: "bg-emerald-500" },
};

const NETWORK_RISK_COLOR = {
  HIGH:   "text-red-400 bg-red-500/10 border-red-500/20",
  MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  LOW:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export default function FalseDiversification() {
  const [openWhy, setOpenWhy] = useState({ "fd-001": true });
  const [expandedCase, setExpandedCase] = useState("fd-001");

  const toggleWhy = (id) =>
    setOpenWhy((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex h-screen bg-[#06090F] text-slate-100 overflow-hidden font-body">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-8 py-8 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto space-y-8 relative z-10">

          {/* Header */}
          <header>
            {/* Intelligence tag */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">ThreadLine Intelligence</span>
              </div>
              <span className="text-[10px] text-slate-600 uppercase tracking-widest">•</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Supply Network Analysis</span>
            </div>

            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <GitMerge className="h-6 w-6" />
                  </span>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">False Diversification Detected</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {FALSE_DIV_SUMMARY.totalExposedFactories} factories across {FALSE_DIV_SUMMARY.totalClusters} clusters
                      share hidden upstream dependencies — detected {FALSE_DIV_SUMMARY.detectedAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SummaryCard
                icon={<GitMerge className="h-4 w-4" />}
                label="Shared Suppliers"
                value={FALSE_DIV_SUMMARY.totalSharedSuppliers}
                color="amber"
              />
              <SummaryCard
                icon={<Factory className="h-4 w-4" />}
                label="Exposed Factories"
                value={FALSE_DIV_SUMMARY.totalExposedFactories}
                color="red"
              />
              <SummaryCard
                icon={<Package className="h-4 w-4" />}
                label="Orders at Risk"
                value={FALSE_DIV_SUMMARY.totalExposedOrders}
                color="amber"
              />
              <div className="bg-[#0B101A] border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">
                  <ShieldAlert className="h-4 w-4" /> Network Risk
                </div>
                <div className="text-2xl font-extrabold text-red-400">{FALSE_DIV_SUMMARY.networkRisk}</div>
                <div className="text-[10px] text-slate-500 mt-1">{FALSE_DIV_SUMMARY.confidence}% AI confidence</div>
              </div>
            </div>
          </header>

          {/* Cases */}
          <div className="space-y-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Detected Dependencies ({FALSE_DIV_CASES.length})
            </h2>

            {FALSE_DIV_CASES.map((c) => {
              const sev = SEVERITY_STYLE[c.severity] || SEVERITY_STYLE.MEDIUM;
              const isExpanded = expandedCase === c.id;
              const whyOpen = openWhy[c.id];

              return (
                <div
                  key={c.id}
                  className={`bg-[#0B101A] border rounded-2xl overflow-hidden transition-all duration-300 ${sev.border}`}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                    className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Severity badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider shrink-0 ${sev.bg} ${sev.border} ${sev.text}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                      {c.severity}
                    </div>

                    {/* Supplier info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Shared Supplier</div>
                      <div className="text-base font-bold text-white">{c.sharedSupplier.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{c.sharedSupplier.supplyType} — {c.sharedSupplier.location}</div>
                    </div>

                    {/* Quick metrics */}
                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <Metric label="Factories" value={c.affectedFactories.length} />
                      <Metric label="Orders" value={c.affectedOrders.length} />
                      <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Network Risk</div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${NETWORK_RISK_COLOR[c.networkRisk]}`}>
                          {c.networkRisk}
                        </span>
                      </div>
                    </div>

                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded detail */}
                  <div className={`grid transition-all duration-400 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-800 px-6 py-6 space-y-6">

                        {/* Core insight */}
                        <div className={`p-4 rounded-xl border ${sev.bg} ${sev.border}`}>
                          <div className={`flex items-start gap-2 text-sm font-medium ${sev.text} leading-relaxed`}>
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            {c.hiddenRisk}
                          </div>
                        </div>

                        {/* Main info grid */}
                        <div className="grid lg:grid-cols-2 gap-6">

                          {/* Left: Supplier + Factories visual */}
                          <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dependency Map</h3>

                            {/* Shared supplier node */}
                            <div className={`p-4 rounded-xl border ${sev.border} ${sev.bg} relative`}>
                              {c.sharedSupplier.singlePointOfFailure && (
                                <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                  <Zap className="h-2.5 w-2.5" /> Single Point of Failure
                                </div>
                              )}
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Upstream Supplier</div>
                              <div className="text-base font-bold text-white">{c.sharedSupplier.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{c.sharedSupplier.supplyType}</div>
                              <div className="text-xs text-slate-500 mt-0.5 font-mono">{c.sharedSupplier.supplierId} · {c.sharedSupplier.location}</div>
                            </div>

                            {/* Connection lines (pure CSS) */}
                            <div className="relative pl-6">
                              <div className="absolute left-3 top-0 bottom-4 w-px border-l-2 border-dashed border-amber-500/30" />
                              <div className="space-y-3">
                                {c.affectedFactories.map((f, idx) => {
                                  const fs = FACTORY_STATUS_STYLE[f.status];
                                  return (
                                    <div key={f.id} className="relative">
                                      {/* Horizontal connector */}
                                      <div className="absolute -left-6 top-5 w-4 border-t-2 border-dashed border-amber-500/30" />
                                      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-2 h-2 rounded-full shrink-0 ${fs.dot}`} />
                                            <div className="min-w-0">
                                              <div className="text-xs font-bold text-slate-200 truncate">{f.name}</div>
                                              <div className="text-[10px] text-slate-500">{f.location} · {f.cluster} Cluster</div>
                                            </div>
                                          </div>
                                          <div className="text-right shrink-0">
                                            <div className="text-[10px] text-slate-500 mb-0.5">Dependency</div>
                                            <div className={`text-xs font-bold ${f.supplyShare > 70 ? 'text-red-400' : f.supplyShare > 50 ? 'text-amber-400' : 'text-yellow-400'}`}>
                                              {f.supplyShare}%
                                            </div>
                                          </div>
                                        </div>
                                        {/* Supply share bar */}
                                        <div className="mt-2 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                                          <div
                                            className={`h-full rounded-full transition-all duration-700 ${f.supplyShare > 70 ? 'bg-red-500' : f.supplyShare > 50 ? 'bg-amber-500' : 'bg-yellow-500'}`}
                                            style={{ width: `${f.supplyShare}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Right: Orders + Risk */}
                          <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Affected Orders & Risk</h3>

                            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Orders Exposed</div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {c.affectedOrders.map((o) => (
                                  <span key={o} className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 rounded text-slate-300">
                                    {o}
                                  </span>
                                ))}
                              </div>
                              <div className="border-t border-slate-800 pt-3">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Network Risk Score</div>
                                <ExplainableRiskScore score={c.networkRiskScore} type="Network" />
                              </div>
                            </div>

                            {/* Cascade scenario */}
                            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                              <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Zap className="h-3.5 w-3.5" /> Cascade Scenario
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{c.cascadeScenario}</p>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4">
                              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Recommended Action</div>
                              <p className="text-xs text-slate-400 leading-relaxed">{c.recommendation}</p>
                            </div>
                          </div>
                        </div>

                        {/* WHY THIS MATTERS — Expandable */}
                        <div className="border border-amber-500/20 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleWhy(c.id)}
                            className="w-full px-5 py-3.5 bg-amber-500/5 hover:bg-amber-500/10 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-amber-400" />
                              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Why This Matters</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-amber-400 transition-transform ${whyOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <div className={`grid transition-all duration-300 ease-in-out ${whyOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                              <div className="px-5 py-4 border-t border-amber-500/10 bg-[#0d1018]">
                                <blockquote className="border-l-2 border-amber-500/40 pl-4 mb-4">
                                  <p className="text-sm text-slate-300 leading-relaxed italic">
                                    "{c.whyItMatters}"
                                  </p>
                                </blockquote>
                                <div className="mt-3 grid sm:grid-cols-3 gap-3">
                                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Apparent Resilience</div>
                                    <div className="text-xs text-emerald-400 font-medium">Geographically diversified factories ✓</div>
                                  </div>
                                  <div className="flex items-center justify-center text-slate-600">
                                    <ChevronRight className="h-5 w-5" />
                                  </div>
                                  <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                                    <div className="text-[10px] font-bold text-red-400 uppercase mb-1">Actual Risk</div>
                                    <div className="text-xs text-red-400 font-medium">Hidden single-supplier dependency ✗</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }) {
  const c = {
    amber: { bg: "bg-amber-500/5",  border: "border-amber-500/20",  text: "text-amber-400",  val: "text-amber-400"  },
    red:   { bg: "bg-red-500/5",    border: "border-red-500/20",    text: "text-red-400",    val: "text-red-400"    },
  }[color] || {};
  return (
    <div className={`bg-[#0B101A] border ${c.border} rounded-xl p-4`}>
      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${c.text}`}>
        {icon} {label}
      </div>
      <div className={`text-3xl font-extrabold tracking-tight ${c.val}`}>{value}</div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</div>
      <div className="text-lg font-bold text-slate-300">{value}</div>
    </div>
  );
}
