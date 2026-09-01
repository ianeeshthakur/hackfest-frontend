"use client";

import React from "react";
import { ChevronRight, Layers, Grid3X3, Network, Droplets, Printer, Scissors, Shirt } from "lucide-react";
import { clusters, FACTORY_TYPES } from "@/lib/clusterData";
import type { Factory, Cluster, FilterState } from "./types";

const TYPE_ICONS: Record<string, React.ElementType> = {
  Spinning: Layers, Weaving: Grid3X3, Knitting: Network,
  Dyeing: Droplets, Printing: Printer, Finishing: Scissors, Garmenting: Shirt,
};

interface Props {
  factories: Factory[];
  selectedClusterId: string | null;
  onClusterSelect: (id: string) => void;
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function ClusterOverview({ factories, selectedClusterId, onClusterSelect, filters, onFiltersChange }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-[13px] font-semibold text-slate-900">Cluster Overview</h2>
      </div>

      <div className="divide-y divide-slate-50">
        {(clusters as Cluster[]).map((cluster) => {
          const cf = factories.filter((f) => f.clusterId === cluster.id);
          const operational = cf.filter((f) => f.status === "OPERATIONAL").length;
          const down = cf.filter((f) => f.status === "DOWN").length;
          const isSelected = selectedClusterId === cluster.id;
          return (
            <button key={cluster.id} id={`cluster-btn-${cluster.id}`}
              onClick={() => onClusterSelect(cluster.id)}
              className={[
                "w-full text-left px-4 py-3 transition-colors flex items-center gap-2 border-l-2",
                isSelected ? "bg-emerald-50 border-emerald-500" : "hover:bg-slate-50 border-transparent",
              ].join(" ")}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="inline-block w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500" />
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide truncate">
                    {cluster.name}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-0 text-center">
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">{cf.length}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide">Factories</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-emerald-600">{operational}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide">Online</div>
                  </div>
                  <div>
                    <div className={`text-[13px] font-bold ${down > 0 ? "text-red-600" : "text-slate-400"}`}>{down}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide">Down</div>
                  </div>
                </div>
              </div>
              <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 ${isSelected ? "text-emerald-500" : "text-slate-300"}`} />
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-3 pb-2 border-t border-slate-100">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Factory Types</p>
        <div className="space-y-0.5">
          {(FACTORY_TYPES as string[]).map((type) => {
            const Icon = TYPE_ICONS[type] ?? Layers;
            const count = factories.filter((f) => f.type === type).length;
            const isActive = filters.type === type;
            return (
              <button key={type} id={`type-filter-${type.toLowerCase()}`}
                onClick={() => onFiltersChange((prev) => ({ ...prev, type: prev.type === type ? "all" : type }))}
                className={[
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors",
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <Icon className="h-3 w-3 flex-shrink-0" />
                <span className="text-[11px] flex-1">{type}</span>
                <span className="text-[10px] text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-4">
        <Dot color="#16a34a" label="Operational" />
        <Dot color="#d97706" label="Warning" />
        <Dot color="#dc2626" label="Down" />
      </div>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}
