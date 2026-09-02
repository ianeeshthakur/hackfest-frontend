import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";

export function RecentEventPanel({ activeEvent }) {
  if (!activeEvent) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm mt-auto text-white">
      <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" /> Recent Event
      </h3>
      <div className="font-bold text-red-400 mb-4 pb-4 border-b border-slate-800">
        {activeEvent.type.replace(/([A-Z])/g, ' $1').toUpperCase()} DETECTED
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Status</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> MONITORING</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Risk Score</span>
          <span className="font-semibold">{activeEvent.riskScore}/100</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Confidence</span>
          <span className="font-semibold">{activeEvent.confidence}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Orders Affected</span>
          <span className="font-semibold">{activeEvent.ordersAffected}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Expected Delay</span>
          <span className="font-semibold text-red-400">+{activeEvent.delayHours}h</span>
        </div>
      </div>
    </div>
  );
}
