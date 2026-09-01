"use client";

import React from "react";
import { MapPin, RotateCcw } from "lucide-react";
import { MapFilters } from "./MapFilters";
import type { FilterState } from "./types";

interface Props {
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
}

export function MapHeader({ filters, onFiltersChange, onReset }: Props) {
  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-[14px] font-semibold text-slate-900 leading-tight">
            Textile MSME Cluster Map
          </h1>
          <p className="text-[11px] text-slate-400">Real-time overview of textile manufacturing clusters</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-slate-600">Live Status</span>
          <span className="text-[10px] text-slate-400">· Updated just now</span>
        </div>

        <button id="reset-map-btn" onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[12px] font-medium hover:bg-slate-50 transition-colors"
          title="Reset to India view">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <MapFilters filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </header>
  );
}
