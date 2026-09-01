"use client";

import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { clusters, FACTORY_TYPES } from "@/lib/clusterData";
import type { Cluster, FilterState } from "./types";

interface Props {
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function MapFilters({ filters, onFiltersChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount = [
    filters.cluster !== "all",
    filters.type !== "all",
    filters.status !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => onFiltersChange({ cluster: "all", type: "all", status: "all" });

  return (
    <div ref={ref} className="relative">
      <button id="map-filters-btn" onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors",
          activeCount > 0
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
        ].join(" ")}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-slate-900 text-[9px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-[12px] font-semibold text-slate-900">Filters</span>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button onClick={clearFilters} className="text-[11px] text-red-500 hover:text-red-700 font-medium">
                  Clear all
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 space-y-4">
            <FilterGroup label="Cluster">
              <Chip label="All Clusters" active={filters.cluster === "all"}
                onClick={() => onFiltersChange((p) => ({ ...p, cluster: "all" }))} />
              {(clusters as Cluster[]).map((c) => (
                <Chip key={c.id} label={c.name} active={filters.cluster === c.id}
                  onClick={() => onFiltersChange((p) => ({ ...p, cluster: c.id }))} />
              ))}
            </FilterGroup>

            <FilterGroup label="Factory Type">
              <Chip label="All Types" active={filters.type === "all"}
                onClick={() => onFiltersChange((p) => ({ ...p, type: "all" }))} />
              {(FACTORY_TYPES as string[]).map((t) => (
                <Chip key={t} label={t} active={filters.type === t}
                  onClick={() => onFiltersChange((p) => ({ ...p, type: t }))} />
              ))}
            </FilterGroup>

            <FilterGroup label="Status">
              {[
                { id: "all",         label: "All",         color: undefined },
                { id: "OPERATIONAL", label: "Operational", color: "#16a34a" },
                { id: "WARNING",     label: "Warning",     color: "#d97706" },
                { id: "DOWN",        label: "Down",        color: "#dc2626" },
              ].map((s) => (
                <Chip key={s.id} label={s.label} active={filters.status === s.id}
                  statusColor={s.color}
                  onClick={() => onFiltersChange((p) => ({ ...p, status: s.id }))} />
              ))}
            </FilterGroup>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ label, active, onClick, statusColor }: {
  label: string; active: boolean; onClick: () => void; statusColor?: string;
}) {
  return (
    <button onClick={onClick}
      className={[
        "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      {statusColor && (
        <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: active ? "white" : statusColor }} />
      )}
      {label}
    </button>
  );
}
