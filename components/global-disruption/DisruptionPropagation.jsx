import React from "react";
import { ArrowDown } from "lucide-react";

export function DisruptionPropagation({ activeEvent }) {
  if (!activeEvent) return null;

  const steps = activeEvent.propagationSteps || [
    { text: "Disruption detected", highlight: true },
    { text: "Analyzing impact..." }
  ];

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
