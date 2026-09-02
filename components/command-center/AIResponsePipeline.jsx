import React, { useEffect } from "react";
import { AIResponseStep } from "./AIResponseStep";
import { useDisruption } from "@/lib/disruptionContext";
import { useAudioPlayer } from "@/lib/voice/useAudioPlayer";

export function AIResponsePipeline() {
  const { currentConfig, simulationState, stepStatus, currentSubStepIndex, subStepStatus } = useDisruption();
  const { say } = useAudioPlayer();

  useEffect(() => {
    if (simulationState === "DETECTING" && stepStatus === "ACTIVE" && currentSubStepIndex === -1) {
       say(`The ${currentConfig?.type === "powerCut" ? "power outage" : currentConfig?.title.toLowerCase()} at Factory F-020 has been detected. I'm checking its impact on your active orders.`);
    } else if (simulationState === "EVALUATING" && stepStatus === "ACTIVE" && currentSubStepIndex === -1) {
       say("I'm evaluating the affected orders and production capacity.");
    } else if (simulationState === "ACTION" && stepStatus === "ACTIVE" && currentSubStepIndex === -1) {
       say("I've found recovery options and I'm comparing available capacity.");
    } else if (simulationState === "RESOLVED" && stepStatus === "ACTIVE" && currentSubStepIndex === -1) {
       say("The disruption has been resolved and affected orders are back on track.");
    }
  }, [simulationState, stepStatus, currentConfig, currentSubStepIndex, say]);

  const getStepState = (stepName) => {
    if (simulationState === "IDLE") return "UPCOMING";
    if (simulationState === "RESOLVED") return stepName === "RESOLVED" ? stepStatus : "COMPLETED";

    const order = ["DETECTING", "EVALUATING", "ACTION", "RESOLVED"];
    const currentIndex = order.indexOf(simulationState);
    const thisIndex = order.indexOf(stepName);

    if (thisIndex < currentIndex) return "COMPLETED";
    if (thisIndex === currentIndex) return stepStatus; 
    return "UPCOMING";
  };

  const activeMessage = () => {
    if (simulationState === "IDLE" || !currentConfig) return "Ready to assist with disruptions.";
    
    // We can also extract the currently active sub-step text!
    const stepKey = simulationState.toLowerCase();
    const subSteps = currentConfig.subSteps?.[stepKey] || [];
    const currentSubStepText = subSteps[currentSubStepIndex];
    
    if (currentSubStepText && (stepStatus === "ACTIVE" || stepStatus === "COMPLETING")) {
      return (
        <span>
          <strong className="text-blue-700">AI is working:</strong> {currentSubStepText}
        </span>
      );
    }
    
    // Fallbacks
    const t = currentConfig.timeline;
    if (simulationState === "DETECTING") return <span><strong className="text-blue-700">AI is working:</strong> {t.detecting}</span>;
    if (simulationState === "EVALUATING") return <span><strong className="text-blue-700">AI is working:</strong> {t.evaluating}</span>;
    if (simulationState === "ACTION") return <span><strong className="text-blue-700">AI is working:</strong> {t.action}</span>;
    if (simulationState === "RESOLVED") return <span><strong className="text-emerald-700">AI response:</strong> {t.resolved}</span>;
    return "";
  };

  const actionLabel = currentConfig?.timelineStages?.action || "Rerouting";
  const resolvedLabel = currentConfig?.timelineStages?.resolved || "Resolved";

  const getSubSteps = (key) => currentConfig?.subSteps?.[key] || [];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative min-h-[300px]">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-[14px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          AI RESPONSE
        </h3>
      </div>

      {/* Main Timeline */}
      <div className="flex w-full mb-8 relative z-10">
        <AIResponseStep 
          label="Detecting" 
          state={getStepState("DETECTING")} 
          isLast={false} 
          subSteps={getSubSteps("detecting")}
          activeIndex={simulationState === "DETECTING" ? currentSubStepIndex : -1}
          subStepStatus={simulationState === "DETECTING" ? subStepStatus : "UPCOMING"}
        />
        <AIResponseStep 
          label="Evaluating" 
          state={getStepState("EVALUATING")} 
          isLast={false} 
          subSteps={getSubSteps("evaluating")}
          activeIndex={simulationState === "EVALUATING" ? currentSubStepIndex : -1}
          subStepStatus={simulationState === "EVALUATING" ? subStepStatus : "UPCOMING"}
        />
        <AIResponseStep 
          label={actionLabel} 
          state={getStepState("ACTION")} 
          isLast={false} 
          subSteps={getSubSteps("action")}
          activeIndex={simulationState === "ACTION" ? currentSubStepIndex : -1}
          subStepStatus={simulationState === "ACTION" ? subStepStatus : "UPCOMING"}
        />
        <AIResponseStep 
          label={resolvedLabel} 
          state={getStepState("RESOLVED")} 
          isLast={true} 
          subSteps={getSubSteps("resolved")}
          activeIndex={simulationState === "RESOLVED" ? currentSubStepIndex : -1}
          subStepStatus={simulationState === "RESOLVED" ? subStepStatus : "UPCOMING"}
        />
      </div>

      <div className={`absolute bottom-5 left-5 right-5 p-4 rounded-lg text-[13px] leading-relaxed transition-colors duration-500 z-0 ${
        simulationState === "RESOLVED" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50/50 text-slate-600"
      }`}>
        {activeMessage()}
      </div>
    </div>
  );
}
