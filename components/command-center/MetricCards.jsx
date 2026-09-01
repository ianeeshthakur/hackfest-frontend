import React from "react";
import { LayoutGrid, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

export function MetricCards({ metrics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Units */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid className="w-4 h-4 text-slate-400" />
          <span className="text-[13px] font-semibold text-slate-600">TOTAL UNITS</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{metrics.total}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across your facility</div>
        </div>
      </div>

      {/* Running */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-0"></div>
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-[13px] font-semibold text-emerald-700">RUNNING</span>
        </div>
        <div className="relative z-10">
          <div className="text-2xl font-bold text-slate-900 transition-all duration-500">
            {metrics.running}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Operating normally</div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-0"></div>
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-[13px] font-semibold text-amber-700">WARNING</span>
        </div>
        <div className="relative z-10">
          <div className="text-2xl font-bold text-slate-900">{metrics.warning}</div>
          <div className="text-[11px] text-slate-500 mt-1">Needs monitoring</div>
        </div>
      </div>

      {/* Disrupted */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-0"></div>
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <AlertOctagon className="w-4 h-4 text-red-500" />
          <span className="text-[13px] font-semibold text-red-700">DISRUPTED</span>
        </div>
        <div className="relative z-10">
          <div className="text-2xl font-bold text-slate-900 transition-all duration-500">
            {metrics.disrupted}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires action</div>
        </div>
      </div>
    </div>
  );
}
