import React from "react";
import { Signal, AlertTriangle, ShieldCheck } from "lucide-react";

export function NetworkWatch({ simState }) {
  const isDisrupted = ["DISRUPTION_DETECTED", "ANALYZING", "ALTERNATIVE_FOUND"].includes(simState);
  const isRerouted = ["REROUTING", "MOVING_TO_MUNDRA", "MOVING_TO_ARABIAN_SEA", "MOVING_TO_SUEZ", "MOVING_TO_HAMBURG", "DELIVERED"].includes(simState);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Watch</h3>
        <span className="text-xs font-semibold text-slate-400">Signals to watch</span>
      </div>
      
      <div className="flex flex-col divide-y divide-slate-100">
        <SignalRow 
          name="Nhava Sheva"
          desc={isRerouted ? "Alternate route active" : (isDisrupted ? "Queue elevated · alternate port recommended" : "Queue building · monitor closely")}
          status={isRerouted ? "RESOLVED" : (isDisrupted ? "HIGH" : "WATCH")}
          isActive={isDisrupted}
        />
        <SignalRow 
          name="Suez corridor"
          desc="Weather advisory · 14h"
          status="WATCH"
        />
        <SignalRow 
          name="Hamburg customs"
          desc="Document queue stable"
          status="LOW"
        />
        <SignalRow 
          name="FX / fuel index"
          desc="Diesel +2.4% this week"
          status="WATCH"
        />
      </div>
    </div>
  );
}

function SignalRow({ name, desc, status, isActive }) {
  const getStatusColor = () => {
    switch(status) {
      case "HIGH": return "text-red-600 bg-red-50 border-red-200";
      case "WATCH": return "text-amber-600 bg-amber-50 border-amber-200";
      case "LOW": return "text-slate-600 bg-slate-100 border-slate-200";
      case "RESOLVED": return "text-teal-600 bg-teal-50 border-teal-200";
      default: return "text-slate-600 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className={`px-5 py-3 flex items-center justify-between transition-colors ${isActive ? "bg-red-50/50" : "hover:bg-slate-50"}`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${isActive ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"}`}>
          {status === "RESOLVED" ? <ShieldCheck className="w-4 h-4" /> : status === "HIGH" ? <AlertTriangle className="w-4 h-4" /> : <Signal className="w-4 h-4" />}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">{name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
        </div>
      </div>
      <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${getStatusColor()}`}>
        {status}
      </div>
    </div>
  );
}
