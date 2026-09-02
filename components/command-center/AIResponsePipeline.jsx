import React from "react";
import { AIResponseStep } from "./AIResponseStep";
import { useDisruption } from "@/lib/disruptionContext";

export function AIResponsePipeline() {
  const { currentConfig, simulationState, stepStatus } = useDisruption();

  const getStepState = (stepName) => {
    // If simulation is idle, everything is upcoming except if simulation is fully done
    if (simulationState === "IDLE") return "UPCOMING";
    if (simulationState === "RESOLVED") return "COMPLETED";

    const order = ["DETECTING", "EVALUATING", "ACTION", "RESOLVED"];
    const currentIndex = order.indexOf(simulationState);
    const thisIndex = order.indexOf(stepName);

    if (thisIndex < currentIndex) return "COMPLETED";
    if (thisIndex === currentIndex) return stepStatus; // ACTIVE or COMPLETING
    return "UPCOMING";
  };

  const activeMessage = () => {
    if (simulationState === "IDLE" || !currentConfig) return "Ready to assist with disruptions.";
    
    const t = currentConfig.timeline;

    if (simulationState === "DETECTING") {
      return (
        <span>
          <strong className="text-blue-700">AI is working:</strong> {t.detecting}
        </span>
      );
    }
    if (simulationState === "EVALUATING") {
      return (
        <span>
          <strong className="text-blue-700">AI is working:</strong> {t.evaluating}
        </span>
      );
    }
    if (simulationState === "ACTION") {
      return (
        <span>
          <strong className="text-blue-700">AI is working:</strong> {t.action}
        </span>
      );
    }
    if (simulationState === "RESOLVED") {
      return (
        <span>
          <strong className="text-emerald-700">AI response:</strong> {t.resolved}
        </span>
      );
    }
    return "";
  };

  const actionLabel = currentConfig?.timelineStages?.action || "Rerouting";
  const resolvedLabel = currentConfig?.timelineStages?.resolved || "Resolved";

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
        <AIResponseStep label={actionLabel} state={getStepState("ACTION")} isLast={false} />
        <AIResponseStep label={resolvedLabel} state={getStepState("RESOLVED")} isLast={true} />
      </div>

      <div className={`p-4 rounded-lg text-[13px] leading-relaxed transition-colors duration-500 ${
        simulationState === "RESOLVED" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50/50 text-slate-600"
      }`}>
        {activeMessage()}
      </div>
    </div>
  );
}
