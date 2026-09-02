import React, { useState } from "react";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { useDisruption } from "@/lib/disruptionContext";

export function AIRecommendationCard() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentConfig, simulationState } = useDisruption();

  // Show only during evaluating, rerouting, or resolved
  if (!currentConfig || simulationState === "IDLE" || simulationState === "DETECTING") return null;

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
          Confidence: {currentConfig.confidence}%
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-6 uppercase">
          {isResolved ? "ORDER REALLOCATED" : "REROUTE AFFECTED ORDERS"}
        </h3>

        {/* Before / After Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricChange 
            label="Risk" 
            before={currentConfig.riskScore} 
            after={currentConfig.recovery.riskScore} 
            isResolved={isResolved} 
            isGood 
          />
          <MetricChange 
            label="Delay" 
            before={`+${currentConfig.delayHours}h`} 
            after={`+${currentConfig.recovery.delayHours}h`} 
            isResolved={isResolved} 
            isGood 
          />
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
                {currentConfig.aiResponse}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-red-600 line-through opacity-70">
                  {currentConfig.affectedUnits.toLocaleString()} units lost
                </span>
                <ArrowRight className="w-3 h-3 text-slate-300" />
                <span className="flex items-center gap-1.5 text-emerald-600">
                  {currentConfig.recovery.availableUnits.toLocaleString()} units restored
                </span>
              </div>
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
      <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 relative z-10">{label}</span>
      <div className="flex items-center gap-2 relative z-10">
        <span className={`text-sm font-bold transition-all duration-500 ${isResolved ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
          {before}
        </span>
        <ArrowRight className={`w-3 h-3 transition-opacity duration-500 ${isResolved ? 'text-slate-300 opacity-100' : 'opacity-0'}`} />
        <span className={`text-sm font-bold transition-all duration-500 ${
          isResolved 
            ? (isGood ? 'text-emerald-600' : 'text-slate-900')
            : 'text-transparent'
        }`}>
          {after}
        </span>
      </div>
    </div>
  );
}
