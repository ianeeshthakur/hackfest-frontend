import React from "react";
import { Package, Ship, Activity } from "lucide-react";

export function MetricCards({ metrics }) {
  return (
    <div className="grid grid-cols-3 gap-6 px-8 py-6">
      <Card 
        title="IN TRANSIT" 
        value={metrics.inTransit} 
        subtitle="active consignments"
        icon={<Package className="w-5 h-5 text-teal-600" />}
        accent="border-teal-500"
      />
      <Card 
        title="PORT EXPOSURE" 
        value={metrics.portExposure} 
        subtitle="congested"
        icon={<Ship className="w-5 h-5 text-amber-600" />}
        accent={metrics.portExposure > 0 ? "border-amber-500 bg-amber-50/30" : "border-slate-200"}
        valueColor={metrics.portExposure > 0 ? "text-amber-600" : "text-slate-900"}
      />
      <Card 
        title="ROUTE HEALTH" 
        value={`${metrics.routeHealth}%`} 
        subtitle="network average"
        icon={<Activity className="w-5 h-5 text-slate-600" />}
        accent="border-slate-200"
        valueColor={metrics.routeHealth < 60 ? "text-red-600" : "text-slate-900"}
      />
    </div>
  );
}

function Card({ title, value, subtitle, icon, accent, valueColor = "text-slate-900" }) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${accent} border-t border-r border-b border-slate-200 shadow-sm p-5 flex items-center justify-between`}>
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</div>
        <div className={`text-3xl font-extrabold tracking-tight ${valueColor}`}>{value}</div>
        <div className="text-sm text-slate-500 font-medium mt-1">{subtitle}</div>
      </div>
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
    </div>
  );
}
