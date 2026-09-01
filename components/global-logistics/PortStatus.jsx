import React from "react";
import { Anchor, CheckCircle2, AlertCircle } from "lucide-react";

export function PortStatus({ simState }) {
  const isDisrupted = ["DISRUPTION_DETECTED", "ANALYZING", "ALTERNATIVE_FOUND"].includes(simState);
  const isRerouted = ["REROUTING", "MOVING_TO_MUNDRA", "MOVING_TO_ARABIAN_SEA", "MOVING_TO_SUEZ", "MOVING_TO_HAMBURG", "DELIVERED"].includes(simState);

  if (isRerouted) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-6">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Port Status</div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-lg border border-red-100 text-red-600 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Nhava Sheva</div>
              <div className="text-xs font-semibold text-red-600 tracking-wide mt-1">CONGESTED</div>
              <div className="text-xs text-slate-500 mt-1">Original route avoided</div>
            </div>
          </div>
          
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-50 rounded-lg border border-teal-100 text-teal-600 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Mundra Port</div>
              <div className="text-xs font-semibold text-teal-600 tracking-wide mt-1">OPERATIONAL</div>
              <div className="text-xs text-slate-500 mt-1">Alternate route selected</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-6">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Port Status</div>
      
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg border mt-0.5 ${isDisrupted ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
          {isDisrupted ? <AlertCircle className="w-5 h-5" /> : <Anchor className="w-5 h-5" />}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800">Nhava Sheva</div>
          {isDisrupted ? (
            <>
              <div className="text-xs font-semibold text-red-600 tracking-wide mt-1">CONGESTED</div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">Queue high &middot; logistics agent recommends Mundra</div>
            </>
          ) : (
            <>
              <div className="text-xs font-semibold text-slate-500 tracking-wide mt-1">OPERATIONAL</div>
              <div className="text-xs text-slate-400 mt-1">Normal vessel processing</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
