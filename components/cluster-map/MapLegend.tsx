"use client";

import React from "react";

export function MapLegend() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2.5">Legend</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-3 rounded-sm border flex-shrink-0"
            style={{ borderColor: "#16a34a", borderStyle: "dashed", backgroundColor: "rgba(22,163,74,0.08)", borderWidth: 1.5 }} />
          <span className="text-[11px] text-slate-600">Cluster Boundary</span>
        </div>
        <LI color="#16a34a" label="Operational Factory" />
        <LI color="#d97706" label="Warning Factory" />
        <LI color="#dc2626" label="Down Factory" />
      </div>
    </div>
  );
}

function LI({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-4 h-4 rounded-full border-2 flex-shrink-0"
        style={{ borderColor: color, backgroundColor: "white" }} />
      <span className="text-[11px] text-slate-600">{label}</span>
    </div>
  );
}
