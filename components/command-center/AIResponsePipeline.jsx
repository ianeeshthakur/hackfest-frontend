import React from "react";
import { AIResponseStep } from "./AIResponseStep";

export function AIResponsePipeline({ simulationState, stepStatus }) {
  const getStepState = (stepName) => {
    // If simulation is idle, everything is upcoming except if simulation is fully done
    if (simulationState === "IDLE") return "UPCOMING";
    if (simulationState === "RESOLVED") return "COMPLETED";

    const order = ["DETECTING", "EVALUATING", "REROUTING", "RESOLVED"];
    const currentIndex = order.indexOf(simulationState);
    const thisIndex = order.indexOf(stepName);

    if (thisIndex < currentIndex) return "COMPLETED";
    if (thisIndex === currentIndex) return stepStatus; // ACTIVE or COMPLETING
    return "UPCOMING";
  };

  const activeMessage = () => {
    if (simulationState === "IDLE") return "Ready to assist with disruptions.";
    
    if (simulationState === "DETECTING") {
      return (
        <span>
          <strong className="text-blue-700">AI is working:</strong> Monitoring unit heartbeat signals and identifying the disruption source.
        </span>
      );
    }
    if (simulationState === "EVALUATING") {
      return (
        <span>
          <strong className="text-blue-700">AI is working:</strong> Assessing affected orders, capacity and production dependencies.
        </span>
      );
    }
    if (simulationState === "REROUTING") {
      return (
        <span>
          <strong className="text-blue-700">AI is working:</strong> Orders linked to the Garmenting Unit are being evaluated for rerouting to available cluster capacity.
        </span>
      );
    }
    if (simulationState === "RESOLVED") {
      return (
        <span>
          <strong className="text-emerald-700">AI response:</strong> Affected orders have been successfully reassigned to available production capacity.
        </span>
      );
    }
    return "";
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-[14px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          AI RESPONSE
        </h3>
      </div>

      <div className="flex w-full mb-8">
        <AIResponseStep label="Detecting" state={getStepState("DETECTING")} isLast={false} />
        <AIResponseStep label="Evaluating" state={getStepState("EVALUATING")} isLast={false} />
        <AIResponseStep label="Rerouting" state={getStepState("REROUTING")} isLast={false} />
        <AIResponseStep label="Resolved" state={getStepState("RESOLVED")} isLast={true} />
      </div>

      <div className={`p-4 rounded-lg text-[13px] leading-relaxed transition-colors duration-500 ${
        simulationState === "RESOLVED" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50/50 text-slate-600"
      }`}>
        {activeMessage()}
      </div>
    </div>
  );
}
