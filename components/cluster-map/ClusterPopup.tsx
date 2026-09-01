"use client";

import React from "react";
import { X } from "lucide-react";
import { FACTORY_TYPES } from "@/lib/clusterData";
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

      <div className="mt-3 pt-2 border-t border-slate-100">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Factory Types</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {FACTORY_TYPES.map((type) => {
            const count = cf.filter(f => f.type === type).length;
            if (count === 0) return null;
            return (
              <div key={type} className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500">{type}</span>
                <span className="text-[11px] font-medium text-slate-700">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Factories ({total})</div>
        <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {cf.map(f => (
            <div key={f.id} className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 truncate mr-2" title={f.name}>{f.name}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" 
                style={{ backgroundColor: f.status === "DOWN" ? "#dc2626" : f.status === "WARNING" ? "#d97706" : "#16a34a" }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SR({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[12px] font-semibold" style={{ color: color ?? "#1e293b" }}>{value}</span>
    </div>
  );
}
