import React from "react";

export function NetworkHealth({ metrics }) {
  // A simple SVG heartbeat line that subtly animates
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight transition-all duration-500">
            {metrics.networkHealth}%
          </div>
          <div className="text-[13px] font-semibold text-slate-500 mt-1">NETWORK HEALTH</div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-100">
           <span className="relative flex h-2 w-2">
             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${metrics.networkHealth < 90 ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
             <span className={`relative inline-flex rounded-full h-2 w-2 ${metrics.networkHealth < 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
           </span>
           <span className="text-[11px] font-bold text-slate-600">LIVE</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Online Units</span>
          <span className="text-[15px] font-bold text-slate-800 transition-all duration-500">{metrics.running}</span>
        </div>
        <div className="w-px bg-slate-200"></div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Warning</span>
          <span className="text-[15px] font-bold text-amber-600">{metrics.warning}</span>
        </div>
        <div className="w-px bg-slate-200"></div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Disrupted</span>
          <span className="text-[15px] font-bold text-red-600 transition-all duration-500">{metrics.disrupted}</span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-[11px] font-semibold text-slate-500 mb-2">Heartbeat Activity</div>
        <div className="h-12 w-full overflow-hidden relative">
          {/* Subtle line visualization */}
          <svg className="absolute top-0 left-0 w-full h-full text-blue-100" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path 
              d="M0 20 L10 20 L15 10 L20 30 L25 20 L40 20 L45 5 L50 35 L55 20 L75 20 L80 15 L85 25 L90 20 L100 20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinejoin="round"
              className="animate-[pulse_2s_ease-in-out_infinite]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
