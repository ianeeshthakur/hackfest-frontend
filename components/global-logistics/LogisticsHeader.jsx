import React from "react";
import { Play, Anchor } from "lucide-react";

export function LogisticsHeader({ onSimulateDisruption, simState }) {
  const isIdle = simState === "IDLE";
  
  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RESILIENCE CONTROL TOWER</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Human-led recovery for textile export operations</p>
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={onSimulateDisruption}
            disabled={!isIdle}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              isIdle 
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Play className="w-4 h-4" />
            {simState === "IDLE" ? "Simulate shipping disruption" : "Simulation running..."}
          </button>
          
          <button disabled className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors opacity-60">
            <Anchor className="w-4 h-4" />
            Simulate port congestion
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          Prototype / Simulation
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)] animate-pulse" />
          <span className="text-sm font-semibold text-slate-700">Suresh Patel</span>
        </div>
      </div>
    </div>
  );
}
