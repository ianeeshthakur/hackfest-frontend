import React from "react";
import { LayoutGrid, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { useDisruption } from "@/lib/disruptionContext";

export function MetricCards() {
  const { currentConfig, simulationState } = useDisruption();

  if (!currentConfig) {
    // IDLE state (no active disruption)
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="TOTAL UNITS" value="50,000" sub="Base Capacity" icon={LayoutGrid} color="slate" />
        <MetricCard title="AVAILABLE" value="50,000" sub="Operating normally" icon={CheckCircle2} color="emerald" />
        <MetricCard title="AFFECTED" value="0" sub="Zero disruption" icon={AlertOctagon} color="red" />
        <MetricCard title="AT RISK" value="0" sub="Zero exposure" icon={AlertTriangle} color="amber" />
      </div>
    );
  }

  // Active Disruption state
  const isResolved = simulationState === "RESOLVED";
  
  // Choose values based on simulation state
  const total = currentConfig.totalUnits.toLocaleString();
  const available = (isResolved ? currentConfig.recovery.availableUnits : currentConfig.availableUnits).toLocaleString();
  const affected = (isResolved ? currentConfig.recovery.affectedUnits : currentConfig.affectedUnits).toLocaleString();
  const atRisk = (isResolved ? currentConfig.recovery.unitsAtRisk : currentConfig.unitsAtRisk).toLocaleString();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="TOTAL UNITS" value={total} sub="Base Capacity" icon={LayoutGrid} color="slate" />
      <MetricCard title="AVAILABLE" value={available} sub="Current capacity" icon={CheckCircle2} color="emerald" />
      <MetricCard title="AFFECTED" value={affected} sub="Lost capacity" icon={AlertOctagon} color="red" />
      <MetricCard title="AT RISK" value={atRisk} sub="Order exposure" icon={AlertTriangle} color="amber" />
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, color }) {
  const colorMap = {
    slate: { bg: 'bg-slate-50', icon: 'text-slate-400', title: 'text-slate-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', title: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500', title: 'text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-500', title: 'text-red-700' },
  };

  const theme = colorMap[color] || colorMap.slate;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-16 h-16 ${theme.bg} rounded-bl-full -z-0`}></div>
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <Icon className={`w-4 h-4 ${theme.icon}`} />
        <span className={`text-[13px] font-semibold ${theme.title}`}>{title}</span>
      </div>
      <div className="relative z-10">
        <div className="text-2xl font-bold text-slate-900 transition-all duration-500">
          {value}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">{sub}</div>
      </div>
    </div>
  );
}
