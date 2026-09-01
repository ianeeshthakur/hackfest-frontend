import React from "react";
import Link from "next/link";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { AlertTriangle, Clock, Zap } from "lucide-react";

export function ActiveDisruption({ simulationState }) {
  if (simulationState === "IDLE") return null;

  const isResolved = simulationState === "RESOLVED";

  return (
    <div className={`p-6 rounded-xl border shadow-sm transition-all duration-500 ${
      isResolved ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-red-200"
    }`}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 mb-1">
            ACTIVE DISRUPTION
          </span>
          <span className={`text-lg font-bold tracking-tight ${
            isResolved ? "text-emerald-700" : "text-slate-900"
          }`}>
            Case: TL-4821
          </span>
        </div>
        {!isResolved ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-100 text-red-700 text-[11px] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            SEVERITY: HIGH
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
          <ExplainableRiskScore score={isResolved ? 24 : 72} type="Factory" className="-ml-1" />
        </div>
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Confidence</span>
          <span className="text-sm font-bold text-slate-700">91%</span>
        </div>
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Expected Delay</span>
          <span className={`text-sm font-bold ${isResolved ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isResolved ? '+2h' : '+9h'}
          </span>
        </div>
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Time to Critical Impact</span>
          <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" /> 6h
          </span>
        </div>
      </div>

      <div className="mb-6">
        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Recommended Action</span>
        <div className="flex items-center justify-between">
          <span className={`inline-flex font-bold tracking-widest uppercase ${isResolved ? 'text-emerald-600' : 'text-blue-600'}`}>
            {isResolved ? 'REROUTED' : 'REROUTE'}
          </span>
          <Link href="/investigation" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-full bg-slate-50 hover:bg-indigo-50">
            Investigate Case
          </Link>
        </div>
      </div>

      {/* 4 Info Cards (WHAT, WHY, IMPACT, ACTION) */}
      <h4 className="text-[11px] font-bold tracking-wider text-slate-500 mb-3 border-t border-slate-100 pt-4">FOR FACTORY OWNER:</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">WHAT</span>
          <span className="text-xs text-slate-700 font-medium">Production disruption detected</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-amber-600 uppercase block mb-1">WHY</span>
          <span className="text-xs text-slate-700 font-medium">Internal operational disruption</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-red-600 uppercase block mb-1">IMPACT</span>
          <span className="text-xs text-slate-700 font-medium">Production capacity reduced by 28%</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">ACTION</span>
          <span className="text-xs text-slate-700 font-medium">Reroute affected order</span>
        </div>
      </div>
    </div>
  );
}
