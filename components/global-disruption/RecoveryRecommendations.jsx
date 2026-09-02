import React from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

export function RecoveryRecommendations({ activeEvent }) {
  if (!activeEvent) return null;

  const recs = activeEvent.recoveryOptions || [
    { title: "Analyze Impact First", delay: "TBD", risk: 50, recommended: true }
  ];

  return (
    <div className="flex flex-col gap-3 mt-4 font-body">
      {recs.map((rec, idx) => (
        <button 
          key={idx}
          className={`group flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
            rec.recommended 
              ? "bg-white border-indigo-200 shadow-sm hover:border-indigo-300 hover:shadow" 
              : "bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${rec.recommended ? "text-indigo-900" : "text-slate-700"}`}>
                {rec.title}
              </span>
              {rec.recommended && (
                <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-slate-500">Expected delay: <span className="font-semibold text-slate-700">{rec.delay}</span></span>
              <span className="text-slate-500">Risk: <span className="font-semibold text-slate-700">{rec.risk}/100</span></span>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${rec.recommended ? "text-indigo-400 group-hover:text-indigo-600" : "text-slate-300 group-hover:text-slate-400"}`} />
        </button>
      ))}
    </div>
  );
}
