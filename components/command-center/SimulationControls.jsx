import React from "react";
import { Play, RotateCcw } from "lucide-react";

export function SimulationControls({ onStart, onReset, simulationState }) {
  const isRunning = simulationState !== "IDLE" && simulationState !== "RESOLVED";

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onStart}
        disabled={isRunning}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          isRunning 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        }`}
      >
        <Play className="w-4 h-4" />
        Simulate Disruption
      </button>
      
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
}
