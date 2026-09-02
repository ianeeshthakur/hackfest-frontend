import React from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

export function RecoveryRecommendations({ activeEvent }) {
  if (!activeEvent) return null;

  const getRecommendations = () => {
    switch (activeEvent.type) {
      case "workerShortage":
        return [
          { title: "Rebalance Production", delay: "+2h", risk: 31, recommended: true },
          { title: "Split Order", delay: "+4h", risk: 39 },
          { title: "Wait", delay: "+6h", risk: 52 }
        ];
      case "powerCut":
        return [
          { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
          { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
          { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
        ];
      case "machineBreakdown":
        return [
          { title: "Reroute to Line 4", delay: "+2h", risk: 22, recommended: true },
          { title: "Expedite Maintenance", delay: "+6h", risk: 40 },
          { title: "Subcontract Production", delay: "+12h", risk: 55 }
        ];
      case "rawMaterialDelay":
        return [
          { title: "Source from Supplier K-2", delay: "+3h", risk: 28, recommended: true },
          { title: "Air Freight Current Order", delay: "+6h", risk: 35 },
          { title: "Wait for Original Shipment", delay: "+24h", risk: 75 }
        ];
      case "logisticsDelay":
        return [
          { title: "Reroute via Mundra Port", delay: "+12h", risk: 30, recommended: true },
          { title: "Air Freight Critical Units", delay: "+24h", risk: 45 },
          { title: "Wait in Current Queue", delay: "+72h", risk: 85 }
        ];
      default:
        return [
          { title: "Analyze Impact First", delay: "TBD", risk: 50, recommended: true }
        ];
    }
  };

  const recs = getRecommendations();

  return (
    <div className="flex flex-col gap-3 mt-4 font-body">
      {recs.map((rec, idx) => (
        <button 
          key={idx}
          className={`group flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
            rec.recommended 
              ? "bg-white border-indigo-200 shadow-sm hover:border-indigo-300 hover:shadow" 
              : "bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${rec.recommended ? "text-indigo-900" : "text-slate-700"}`}>
                {rec.title}
              </span>
              {rec.recommended && (
                <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-slate-500">Expected delay: <span className="font-semibold text-slate-700">{rec.delay}</span></span>
              <span className="text-slate-500">Risk: <span className="font-semibold text-slate-700">{rec.risk}/100</span></span>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 ${rec.recommended ? "text-indigo-400 group-hover:text-indigo-600" : "text-slate-300 group-hover:text-slate-400"}`} />
        </button>
      ))}
    </div>
  );
}
