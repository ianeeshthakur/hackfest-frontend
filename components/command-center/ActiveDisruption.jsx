import React from "react";
import Link from "next/link";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { useDisruption } from "@/lib/disruptionContext";

export function ActiveDisruption() {
  const { currentConfig, simulationState } = useDisruption();

  if (!currentConfig || simulationState === "IDLE") return null;

  const isResolved = simulationState === "RESOLVED";

  const title = currentConfig.title;
  const severity = currentConfig.severity;
  const description = currentConfig.description;
  const confidence = currentConfig.confidence;
  const riskScore = isResolved ? currentConfig.recovery.riskScore : currentConfig.riskScore;
  const delay = isResolved ? currentConfig.recovery.delayHours : currentConfig.delayHours;
  const ordersAffected = currentConfig.ordersAffected;

  return (
    <div className={`p-6 rounded-xl border shadow-sm transition-all duration-500 ${
      isResolved ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-red-200"
    }`}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 mb-1 uppercase">
            {isResolved ? "RECENT EVENT" : "ACTIVE DISRUPTION"}
          </span>
          <span className={`text-lg font-bold tracking-tight ${
            isResolved ? "text-emerald-700" : "text-slate-900"
          }`}>
            {title}
          </span>
        </div>
        {!isResolved ? (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${
            severity === "HIGH" || severity === "CRITICAL" ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                severity === "HIGH" || severity === "CRITICAL" ? 'bg-red-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                severity === "HIGH" || severity === "CRITICAL" ? 'bg-red-500' : 'bg-amber-500'
              }`}></span>
            </span>
            SEVERITY: {severity}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-[11px] font-bold">
            RESOLVED
          </span>
        )}
      </div>
      
      {/* Core Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Risk</span>
          <ExplainableRiskScore score={riskScore} type="Disruption" factors={currentConfig?.riskFactors} className="-ml-1" />
        </div>
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Confidence</span>
          <span className="text-sm font-bold text-slate-700">{confidence}%</span>
        </div>
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Expected Delay</span>
          <span className={`text-sm font-bold ${isResolved ? 'text-emerald-600' : 'text-amber-600'}`}>
            +{delay}h
          </span>
        </div>
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Orders Affected</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
             {ordersAffected}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
        <div className="text-sm font-semibold text-slate-700 mb-1">Impact Analysis</div>
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Footer */}
      {!isResolved && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            AI Evaluating Context...
          </span>
        </div>
      )}
      
      {isResolved && (
        <div className="pt-4 border-t border-slate-100">
          <div className="flex gap-2">
            <Link 
              href="/recovery" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm text-center"
            >
              Review Recovery Plan
            </Link>
            <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors text-center">
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
