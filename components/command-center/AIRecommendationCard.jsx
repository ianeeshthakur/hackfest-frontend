import React, { useState } from "react";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";

export function AIRecommendationCard({ simulationState }) {
  const [isOpen, setIsOpen] = useState(false);

  // Show only during evaluating, rerouting, or resolved
  if (simulationState === "IDLE" || simulationState === "DETECTING") return null;

  const isResolved = simulationState === "RESOLVED";

  return (
    <div className={`mt-6 rounded-xl border shadow-lg overflow-hidden transition-all duration-500 ${
      isResolved ? "border-blue-200 shadow-blue-900/5 bg-gradient-to-br from-blue-50/50 to-white" : "border-indigo-200 shadow-indigo-900/10 bg-gradient-to-br from-indigo-50 to-white"
    }`}>
      
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-indigo-100 bg-white/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-600">
            AI Recommendation
          </span>
        </div>
        <span className="text-[10px] font-bold bg-white border border-indigo-100 text-indigo-700 px-2 py-1 rounded-full uppercase">
          Confidence: 88%
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-6">
          REROUTE ORDER TX-2048
        </h3>

        {/* Before / After Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricChange label="Risk" before="72" after="24" isResolved={isResolved} isGood />
          <MetricChange label="Delay" before="+9h" after="+2h" isResolved={isResolved} isGood />
          <div className="flex flex-col p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">Cost</span>
            <span className="text-sm font-bold text-amber-600">+₹18,500</span>
          </div>
        </div>

        {/* Interactive Explanation Dropdown */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 hover:bg-indigo-100/50 transition-colors border border-indigo-100 text-indigo-700"
        >
          <span className="text-xs font-bold uppercase tracking-wider">Why this recommendation?</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="p-4 bg-white border border-slate-100 rounded-lg shadow-inner">
              <p className="text-xs text-slate-600 font-medium mb-3 leading-relaxed">
                The agent evaluated 14 alternative paths and identified this reroute as the optimal balance between cost and delivery time.
              </p>
              <ul className="space-y-2 text-[11px] font-medium text-slate-700">
                <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> Deadline proximity (Critical: &lt;48h remaining)</li>
                <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> Available alternate capacity (F-X7K92 matches volume)</li>
                <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> Certification match (GOTS certified facility required)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Expected delay reduction (Saved 7 hours)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Risk reduction (Score drops 72 → 24)</li>
                <li className="flex items-start gap-2"><span className="text-amber-500">•</span> Cost (+₹18k is within auto-approval threshold)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricChange({ label, before, after, isResolved, isGood }) {
  return (
    <div className="flex flex-col p-3 bg-white rounded-lg border border-slate-100 shadow-sm relative overflow-hidden">
      <span className="text-[10px] uppercase font-bold text-slate-400 mb-2">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-400 line-through decoration-slate-300">{before}</span>
        <ArrowRight className="h-3 w-3 text-slate-300" />
        <span className={`text-sm font-bold ${isResolved ? (isGood ? 'text-emerald-600' : 'text-slate-800') : 'text-indigo-600'}`}>
          {after}
        </span>
      </div>
    </div>
  );
}
