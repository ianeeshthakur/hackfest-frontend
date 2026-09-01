import React from "react";
import { ACTIVE_DISRUPTION_DATA } from "@/lib/commandCenterData";

export function ActiveDisruption({ simulationState }) {
  if (simulationState === "IDLE") return null;

  const isResolved = simulationState === "RESOLVED";

  return (
    <div className={`p-5 rounded-xl border shadow-sm transition-colors duration-500 ${
      isResolved ? "bg-emerald-50 border-emerald-200" : "bg-white border-red-200"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-wider text-slate-500">
              {ACTIVE_DISRUPTION_DATA.unitName}
            </span>
            <span className={`text-[15px] font-bold tracking-tight mt-0.5 ${
              isResolved ? "text-emerald-700" : "text-slate-900"
            }`}>
              {isResolved ? "RESOLVED" : ACTIVE_DISRUPTION_DATA.title}
            </span>
          </div>
        </div>
        {!isResolved ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-bold bg-red-100 text-red-700">
            {ACTIVE_DISRUPTION_DATA.severity}
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700">
            SUCCESS
          </span>
        )}
      </div>
      
      {!isResolved ? (
        <>
          <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
            {ACTIVE_DISRUPTION_DATA.description}
          </p>
          <div className="flex items-center gap-2 p-2.5 rounded bg-red-50/50 border border-red-100/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[12px] font-medium text-red-700">
              {ACTIVE_DISRUPTION_DATA.missedHeartbeats} missed heartbeats — unit unresponsive
            </span>
          </div>
        </>
      ) : (
        <p className="text-[13px] text-emerald-700 leading-relaxed">
          Orders successfully rerouted. Production capacity has been balanced across available clusters.
        </p>
      )}
    </div>
  );
}
