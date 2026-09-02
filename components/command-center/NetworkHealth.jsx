import React from "react";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { useDisruption } from "@/lib/disruptionContext";

export function NetworkHealth() {
  const { currentConfig, simulationState } = useDisruption();
  const isResolved = simulationState === "RESOLVED";

  // IDLE State
  if (!currentConfig) {
    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight transition-all duration-500">
              100%
            </div>
            <div className="text-[13px] font-semibold text-slate-500 mt-1">OPERATIONAL RATE</div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-100">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <span className="text-[11px] font-bold text-slate-600">LIVE</span>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Orders Affected</span>
            <span className="text-[15px] font-bold text-slate-800 transition-all duration-500">0</span>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Expected Delay</span>
            <span className="text-[15px] font-bold text-slate-800 transition-all duration-500">0h</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mb-6 flex justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Risk Score</span>
            <ExplainableRiskScore score={12} type="Network" />
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-[11px] font-semibold text-slate-500 mb-2">Heartbeat Activity</div>
          <div className="h-12 w-full overflow-hidden relative">
            <svg className="absolute top-0 left-0 w-full h-full text-emerald-100" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path d="M0,20 L10,20 L15,10 L25,30 L30,20 L100,20" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Active Disruption State
  const opRate = Math.round((currentConfig.availableUnits / currentConfig.totalUnits) * 100);
  const resolvedOpRate = Math.round((currentConfig.recovery.availableUnits / currentConfig.totalUnits) * 100);
  const displayRate = isResolved ? resolvedOpRate : opRate;

  const riskScore = isResolved ? currentConfig.recovery.riskScore : currentConfig.riskScore;
  const delay = isResolved ? currentConfig.recovery.delayHours : currentConfig.delayHours;
  const isBad = displayRate < 90;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className={`text-3xl font-bold tracking-tight transition-all duration-500 ${isBad ? 'text-red-600' : 'text-slate-900'}`}>
            {displayRate}%
          </div>
          <div className="text-[13px] font-semibold text-slate-500 mt-1">OPERATIONAL RATE</div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-100">
           <span className="relative flex h-2 w-2">
             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBad ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
             <span className={`relative inline-flex rounded-full h-2 w-2 ${isBad ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
           </span>
           <span className="text-[11px] font-bold text-slate-600">LIVE</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Orders Affected</span>
          <span className="text-[15px] font-bold text-amber-600 transition-all duration-500">{currentConfig.ordersAffected}</span>
        </div>
        <div className="w-px bg-slate-200"></div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Expected Delay</span>
          <span className="text-[15px] font-bold text-red-600 transition-all duration-500">+{delay}h</span>
        </div>
        <div className="w-px bg-slate-200"></div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Confidence</span>
          <span className="text-[15px] font-bold text-blue-600 transition-all duration-500">{currentConfig.confidence}%</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mb-6 flex justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Risk Score</span>
          <ExplainableRiskScore score={riskScore} type="Network" factors={currentConfig?.riskFactors} />
        </div>
        {currentConfig.powerStatus && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Power</span>
            <span className="text-[12px] font-bold text-red-600">{currentConfig.powerStatus}</span>
          </div>
        )}
        {currentConfig.machineStatus && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Machines</span>
            <span className="text-[12px] font-bold text-red-600">{currentConfig.machineStatus}</span>
          </div>
        )}
        {currentConfig.workerAvailability && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Workers</span>
            <span className="text-[12px] font-bold text-amber-600">{currentConfig.workerAvailability}</span>
          </div>
        )}
        {currentConfig.materialAvailability && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Material</span>
            <span className="text-[12px] font-bold text-amber-600">{currentConfig.materialAvailability}</span>
          </div>
        )}
      </div>

      <div className="mt-auto relative z-10">
        <div className="text-[11px] font-semibold text-slate-500 mb-2">Heartbeat Activity</div>
        <div className="h-12 w-full overflow-hidden relative">
          <svg className={`absolute top-0 left-0 w-full h-full ${isBad ? 'text-red-100' : 'text-blue-100'}`} preserveAspectRatio="none" viewBox="0 0 100 40">
            {isBad ? (
              <path d="M0,20 L10,20 L15,35 L20,5 L25,20 L100,20" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            ) : (
              <path d="M0,20 L10,20 L15,10 L25,30 L30,20 L100,20" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
