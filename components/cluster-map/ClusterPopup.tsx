"use client";

import React from "react";
import { X } from "lucide-react";
import type { Factory, Cluster } from "./types";

interface Props {
  cluster: Cluster;
  allFactories: Factory[];
  onClose: () => void;
}

export function ClusterPopup({ cluster, allFactories, onClose }: Props) {
  const cf = allFactories.filter((f) => f.clusterId === cluster.id);
  const total = cf.length;
  const operational = cf.filter((f) => f.status === "OPERATIONAL").length;
  const down = cf.filter((f) => f.status === "DOWN").length;
  const rate = total > 0 ? ((operational / total) * 100).toFixed(0) : "0";

  return (
    <div className="font-body" style={{ minWidth: 200 }}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[13px] font-semibold text-slate-900">{cluster.name}</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="text-[11px] text-slate-400 mb-3">{cluster.city}, {cluster.state}</div>
      <div className="space-y-1.5">
        <SR label="Total Factories" value={total} />
        <SR label="Operational" value={operational} color="#16a34a" />
        <SR label="Down" value={down} color={down > 0 ? "#dc2626" : undefined} />
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Operational Rate</span>
          <span className="text-[12px] font-bold" style={{ color: Number(rate) >= 90 ? "#16a34a" : "#d97706" }}>
            {rate}%
          </span>
        </div>
      </div>
    </div>
  );
}

function SR({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[12px] font-semibold" style={{ color: color ?? "#1e293b" }}>{value}</span>
    </div>
  );
}
