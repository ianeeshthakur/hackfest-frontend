"use client";

import React from "react";
import type { Factory } from "./types";

interface Props { factories: Factory[]; totalClusters: number; }

export function OverallStatus({ factories, totalClusters }: Props) {
  const totalFactories = factories.length;
  const operational = factories.filter((f) => f.status === "OPERATIONAL").length;
  const warning     = factories.filter((f) => f.status === "WARNING").length;
  const down        = factories.filter((f) => f.status === "DOWN").length;
  const rate = totalFactories > 0 ? ((operational / totalFactories) * 100).toFixed(1) : "0.0";
  const rateNum = Number(rate);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-[13px] font-semibold text-slate-900">Overall Status</h2>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        <SI label="Total Clusters"  value={totalClusters} />
        <SI label="Total Factories" value={totalFactories} />
        <SI label="Operational"     value={operational}    color="#16a34a" />
        {warning > 0 && <SI label="Warning" value={warning} color="#d97706" />}
        <SI label="Down" value={down} color={down > 0 ? "#dc2626" : undefined} />
      </div>
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-slate-500">Operational Rate</span>
          <span className="text-[16px] font-bold"
            style={{ color: rateNum >= 90 ? "#16a34a" : rateNum >= 70 ? "#d97706" : "#dc2626" }}>
            {rate}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${rate}%`, backgroundColor: rateNum >= 90 ? "#16a34a" : rateNum >= 70 ? "#d97706" : "#dc2626" }} />
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[10px] text-slate-400">Live · Updated just now</span>
      </div>
    </div>
  );
}

function SI({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[13px] font-bold" style={{ color: color ?? "#1e293b" }}>{value}</span>
    </div>
  );
}
