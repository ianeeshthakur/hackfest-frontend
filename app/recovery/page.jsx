"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { Sparkles, Clock, DollarSign, ShieldAlert, CheckCircle2, ArrowRight, BarChart3, Map } from "lucide-react";
import { RoleGuard } from "@/components/ui/RoleGuard";
import Link from "next/link";

import { useDisruption } from "@/lib/disruptionContext";

const DEFAULT_SCENARIOS = [
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

function getDynamicScenarios(disruption) {
  if (!disruption) return DEFAULT_SCENARIOS;

  const baseDelay = disruption.delayHours || 9;
  const baseRisk = disruption.riskScore || 72;

  // Generate options based on type
  switch (disruption.type) {
    case "workerShortage":
      return [
        {
          id: "wait", label: "OPTION A", name: "WAIT",
          description: "Do nothing and absorb the delay.",
          delay: `+${baseDelay}h`, delaySortVal: baseDelay,
          cost: "₹0", costSortVal: 0,
          risk: baseRisk, confidence: 85, recommended: false, color: "red",
          factors: ["No direct cost"], downsides: ["Maximum delay", "SLA breach risk"]
        },
        {
          id: "reschedule", label: "OPTION B", name: "RESCHEDULE",
          description: "Prioritize critical orders and shift production to another available line.",
          delay: `+${Math.max(1, Math.round(baseDelay * 0.5))}h`, delaySortVal: baseDelay * 0.5,
          cost: "+₹2,500", costSortVal: 2500,
          risk: Math.round(baseRisk * 0.6), confidence: 88, recommended: false, color: "amber",
          factors: ["Internal capacity reallocation", "Minimal cost"], downsides: ["Disrupts other minor orders"]
        },
        {
          id: "reallocate", label: "OPTION C", name: "REALLOCATE CAPACITY",
          description: "Hire temporary contract workforce or reallocate available workforce/capacity.",
          delay: "+1h", delaySortVal: 1,
          cost: "+₹8,000", costSortVal: 8000,
          risk: Math.round(baseRisk * 0.3), confidence: 92, recommended: true, color: "emerald",
          factors: ["Fastest recovery", "Maintains original line throughput"], downsides: ["Higher operational cost"]
        }
      ];
    case "powerCut":
      return [
        {
          id: "wait", label: "OPTION A", name: "WAIT",
          description: "Wait for grid restoration.",
          delay: `+${baseDelay}h`, delaySortVal: baseDelay,
          cost: "₹0", costSortVal: 0,
          risk: baseRisk, confidence: 90, recommended: false, color: "red",
          factors: ["Zero action required"], downsides: ["Uncertain grid stability"]
        },
        {
          id: "backup", label: "OPTION B", name: "BACKUP GENERATION",
          description: "Run on backup generators at reduced capacity.",
          delay: `+${Math.max(1, Math.round(baseDelay * 0.6))}h`, delaySortVal: baseDelay * 0.6,
          cost: "+₹15,000", costSortVal: 15000,
          risk: Math.round(baseRisk * 0.7), confidence: 95, recommended: false, color: "amber",
          factors: ["Immediate response"], downsides: ["High fuel cost", "Not sustainable long-term"]
        },
        {
          id: "shift", label: "OPTION C", name: "SHIFT FACILITY",
          description: "Shift production to another facility in the same cluster.",
          delay: "+2h", delaySortVal: 2,
          cost: "+₹22,000", costSortVal: 22000,
          risk: Math.round(baseRisk * 0.3), confidence: 89, recommended: true, color: "emerald",
          factors: ["Bypasses local grid issues fully", "Maintains timeline"], downsides: ["High logistical overhead"]
        }
      ];
    case "PORT_CONGESTION":
      return [
        {
          id: "wait", label: "OPTION A", name: "WAIT",
          description: "Hold vessel at anchorage until berthing window opens.",
          delay: `+${baseDelay}h`, delaySortVal: baseDelay,
          cost: "₹0", costSortVal: 0,
          risk: baseRisk, confidence: 95, recommended: false, color: "red",
          factors: ["No rerouting cost"], downsides: ["Extreme delay", "High inventory risk"]
        },
        {
          id: "alternate_port", label: "OPTION B", name: "ALTERNATE PORT",
          description: "Reroute to Mundra Port and use overland transport.",
          delay: `+${Math.max(24, Math.round(baseDelay * 0.4))}h`, delaySortVal: 24,
          cost: "+$3,500", costSortVal: 3500,
          risk: Math.round(baseRisk * 0.5), confidence: 88, recommended: true, color: "emerald",
          factors: ["Avoids congestion completely", "Known cost"], downsides: ["Additional trucking required"]
        },
        {
          id: "air_freight", label: "OPTION C", name: "AIR FREIGHT PRIORITY",
          description: "Split shipment: air freight priority units, wait for the rest.",
          delay: "+48h", delaySortVal: 48,
          cost: "+$12,000", costSortVal: 12000,
          risk: Math.round(baseRisk * 0.2), confidence: 92, recommended: false, color: "amber",
          factors: ["Saves critical orders"], downsides: ["Extremely high cost"]
        }
      ];
    case "rawMaterialDelay":
      return [
        {
          id: "wait", label: "OPTION A", name: "WAIT",
          description: "Wait for delayed material shipment.",
          delay: `+${baseDelay}h`, delaySortVal: baseDelay,
          cost: "₹0", costSortVal: 0,
          risk: baseRisk, confidence: 90, recommended: false, color: "red",
          factors: ["No sourcing effort"], downsides: ["Stalls production lines completely"]
        },
        {
          id: "reallocate", label: "OPTION B", name: "INVENTORY REALLOCATION",
          description: "Reallocate inventory from non-critical orders to bridge the gap.",
          delay: `+${Math.max(1, Math.round(baseDelay * 0.3))}h`, delaySortVal: 1,
          cost: "₹0", costSortVal: 0,
          risk: Math.round(baseRisk * 0.6), confidence: 85, recommended: false, color: "amber",
          factors: ["No direct financial cost"], downsides: ["Delays lower priority orders later"]
        },
        {
          id: "alternate_supplier", label: "OPTION C", name: "ALTERNATE SUPPLIER",
          description: "Engage pre-approved local alternate supplier for partial sourcing.",
          delay: "+2h", delaySortVal: 2,
          cost: "+₹14,500", costSortVal: 14500,
          risk: Math.round(baseRisk * 0.2), confidence: 94, recommended: true, color: "emerald",
          factors: ["Restores production quickly", "Approved quality"], downsides: ["Premium spot-buy pricing"]
        }
      ];
    case "GEOPOLITICAL_EVENT":
      return [
        {
          id: "wait", label: "OPTION A", name: "HOLD ANCHORAGE",
          description: "Hold at safe anchorage until route is clear.",
          delay: "TBD", delaySortVal: 999,
          cost: "$0", costSortVal: 0,
          risk: baseRisk, confidence: 50, recommended: false, color: "red",
          factors: ["Avoids active conflict zone"], downsides: ["Indefinite delay"]
        },
        {
          id: "air_freight", label: "OPTION B", name: "AIR FREIGHT",
          description: "Recall shipment and air freight critical cargo.",
          delay: "+72h", delaySortVal: 72,
          cost: "+$45,000", costSortVal: 45000,
          risk: Math.round(baseRisk * 0.6), confidence: 85, recommended: false, color: "amber",
          factors: ["Fastest delivery"], downsides: ["Astronomical cost", "Volume restricted"]
        },
        {
          id: "divert", label: "OPTION C", name: "DIVERT ROUTE",
          description: "Divert via Cape of Good Hope.",
          delay: `+${baseDelay}h`, delaySortVal: baseDelay,
          cost: "+$8,500", costSortVal: 8500,
          risk: Math.round(baseRisk * 0.4), confidence: 95, recommended: true, color: "emerald",
          factors: ["Safest maritime route", "Certain ETA"], downsides: ["Adds 14+ days transit"]
        }
      ];
    case "logisticsDelay":
      return [
        {
          id: "wait", label: "OPTION A", name: "WAIT",
          description: "Proceed with original delayed carrier.",
          delay: `+${baseDelay}h`, delaySortVal: baseDelay,
          cost: "₹0", costSortVal: 0,
          risk: baseRisk, confidence: 90, recommended: false, color: "red",
          factors: ["No disruption to paperwork"], downsides: ["Accepts full delay penalty"]
        },
        {
          id: "split", label: "OPTION B", name: "SPLIT SHIPMENT",
          description: "Split shipment and expedite 20% of critical volume.",
          delay: `+${Math.round(baseDelay * 0.5)}h`, delaySortVal: baseDelay * 0.5,
          cost: "+₹9,000", costSortVal: 9000,
          risk: Math.round(baseRisk * 0.5), confidence: 88, recommended: false, color: "amber",
          factors: ["Saves highest priority items"], downsides: ["Splits inventory tracking"]
        },
        {
          id: "reroute", label: "OPTION C", name: "ALTERNATE CARRIER",
          description: "Cross-dock and switch to alternate premium carrier route.",
          delay: "+12h", delaySortVal: 12,
          cost: "+₹16,000", costSortVal: 16000,
          risk: Math.round(baseRisk * 0.3), confidence: 92, recommended: true, color: "emerald",
          factors: ["Bypasses current bottleneck", "Predictable new ETA"], downsides: ["Requires immediate cross-docking"]
        }
      ];
    default:
      return DEFAULT_SCENARIOS;
  }
}

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
  const { currentConfig } = useDisruption();
  const scenarios = getDynamicScenarios(currentConfig);
  
  // Find recommended scenario ID, fallback to last item or index 0
  const recommendedId = scenarios.find(s => s.recommended)?.id || scenarios[scenarios.length - 1]?.id || "wait";
  const [selected, setSelected] = useState(recommendedId);

  // If disruption changes, we might want to update selected to the new recommendation
  React.useEffect(() => {
    setSelected(scenarios.find(s => s.recommended)?.id || scenarios[scenarios.length - 1]?.id || "wait");
  }, [currentConfig]);

  const selectedScenario = scenarios.find(s => s.id === selected) || scenarios[0];

  return (
    <RoleGuard allowedRole="owner">
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
                  <p className="text-slate-500 text-sm mt-0.5">
                    {currentConfig 
                      ? `AI-generated options for ${currentConfig.title}` 
                      : "AI-generated options for Case TL-4821"}
                  </p>
                </div>
              </div>
              {selected && (
                <Link
                  href="/my-network?fromRecovery=true"
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
                >
                  <Map className="h-4 w-4" />
                  Go to My Network to Accept / Reject
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
                  Proceed to My Network to submit approval →
                </span>
              </div>
            )}
          </header>

          {/* Option Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {scenarios.map((scenario) => {
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
                    {scenarios.map((s) => {
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
                      {scenarios.map((s) => {
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
                    {scenarios.map((s) => (
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
                href="/my-network?fromRecovery=true"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-emerald-900/30 whitespace-nowrap shrink-0"
              >
                Accept / Reject on My Network
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