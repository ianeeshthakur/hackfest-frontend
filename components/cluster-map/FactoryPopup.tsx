"use client";

import React from "react";
import { X, ExternalLink, ArrowRightLeft } from "lucide-react";
import { clusters } from "@/lib/clusterData";
import type { Factory, Cluster } from "./types";

type StatusKey = "OPERATIONAL" | "WARNING" | "DOWN";

const STATUS_CONFIG: Record<StatusKey, { label: string; color: string; bg: string }> = {
  OPERATIONAL: { label: "Operational", color: "#16a34a", bg: "#f0fdf4" },
  WARNING:     { label: "Warning",     color: "#d97706", bg: "#fffbeb" },
  DOWN:        { label: "Down",        color: "#dc2626", bg: "#fef2f2" },
};

interface Props { 
  factory: Factory; 
  onClose: () => void;
  onViewFactory: () => void;
  onFindAlternatives: () => void;
}

export function FactoryPopup({ factory, onClose, onViewFactory, onFindAlternatives }: Props) {
  const status = STATUS_CONFIG[factory.status as StatusKey] ?? STATUS_CONFIG.OPERATIONAL;
  const cluster = (clusters as Cluster[]).find((c) => c.id === factory.clusterId);

  return (
    <div className="font-body" style={{ minWidth: 240 }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[10px] font-mono text-slate-400 tracking-wide uppercase">
            {factory.id}
          </span>
          <h3 className="text-[13px] font-semibold text-slate-900 leading-tight mt-0.5">
            {factory.name}
          </h3>
        </div>
        <button onClick={onClose} className="ml-2 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <Row label="Cluster" value={cluster?.name ?? factory.clusterId} />
        <Row label="Type"    value={factory.type} />
        <Row label="Status" value={
          <span style={{ color: status.color, backgroundColor: status.bg }}
            className="px-1.5 py-0.5 rounded text-[11px] font-semibold">
            {status.label}
          </span>
        } />
        <Row label="Capacity" value={`${factory.capacity.toLocaleString()} units/day`} />
        
        {/* These fields are now hydrated from real data */}
        <Row label="Current Load" value={`${factory.currentLoad}%`} />
        <Row label="Power" value={factory.status === "DOWN" ? "Offline" : "Online"} />
        <Row label={factory.status === "DOWN" ? "Orders affected" : "Orders"} value={`${factory.orders} ${factory.status === "DOWN" ? "" : "active"}`} />

        {factory.disruption && (
          <Row label="Issue" value={<span className="text-red-600 text-[11px]">{factory.disruption}</span>} />
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button id={`view-factory-${factory.id}`} onClick={onViewFactory}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg hover:bg-slate-700 transition-colors">
          <ExternalLink className="h-3 w-3" />View Factory
        </button>
        <button id={`find-alternatives-${factory.id}`} onClick={onFindAlternatives}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowRightLeft className="h-3 w-3" />Find Alternatives
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[11px] text-slate-400 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-[11px] font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}
