import React from "react";
import { ArrowDown } from "lucide-react";

export function DisruptionPropagation({ activeEvent }) {
  if (!activeEvent) return null;

  const getSteps = () => {
    switch (activeEvent.type) {
      case "workerShortage":
        return [
          { text: "Factory production capacity -24%", highlight: true },
          { text: "3 orders exposed" },
          { text: "8,500 units delayed", highlight: true },
          { text: "Expected delay +6h" },
          { text: "Alternate capacity identified", success: true }
        ];
      case "powerCut":
        return [
          { text: "Power failure halts Spinning Line", highlight: true },
          { text: "18% total capacity lost" },
          { text: "2 orders delayed", highlight: true },
          { text: "Expected restoration +4h" },
          { text: "Backup generators inadequate for full load" }
        ];
      case "machineBreakdown":
        return [
          { text: "Machine M-4 offline", highlight: true },
          { text: "Production line 3 halted" },
          { text: "31% capacity reduction", highlight: true },
          { text: "7,800 units delayed" },
          { text: "Maintenance dispatched, ETA 8h", success: true }
        ];
      case "rawMaterialDelay":
        return [
          { text: "Supplier T-4 misses shipment", highlight: true },
          { text: "Inventory buffers depleted" },
          { text: "37% capacity at risk", highlight: true },
          { text: "Expected delay +12h" },
          { text: "Alternative sourcing activated", success: true }
        ];
      case "logisticsDelay":
        return [
          { text: "Transit delay on NH-44", highlight: true },
          { text: "Shipment stuck in queue" },
          { text: "15,000 units delayed", highlight: true },
          { text: "Expected delay +48h" },
          { text: "Rerouting via alternate port evaluated", success: true }
        ];
      default:
        return [
          { text: "Disruption detected", highlight: true },
          { text: "Analyzing impact..." }
        ];
    }
  };

  const steps = getSteps();

  return (
    <div className="flex flex-col gap-2 mt-4 font-body">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className={`p-3 rounded-lg border text-sm font-medium transition-colors
            ${step.highlight ? "bg-red-50 border-red-100 text-red-700" : 
              step.success ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
              "bg-slate-50 border-slate-200 text-slate-700"}`}
          >
            {step.text}
          </div>
          {idx < steps.length - 1 && (
            <div className="flex justify-center -my-1 relative z-10">
              <div className="bg-white p-1 rounded-full">
                <ArrowDown className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
