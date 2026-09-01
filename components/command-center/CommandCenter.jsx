"use client";

import React, { useState, useEffect, useRef } from "react";
import { MetricCards } from "./MetricCards";
import { NetworkHealth } from "./NetworkHealth";
import { ActiveDisruption } from "./ActiveDisruption";
import { AIResponsePipeline } from "./AIResponsePipeline";
import { SimulationControls } from "./SimulationControls";
import { INITIAL_METRICS, DISRUPTED_METRICS, RESOLVED_METRICS } from "@/lib/commandCenterData";

export function CommandCenter() {
  const [simulationState, setSimulationState] = useState("IDLE"); 
  const [stepStatus, setStepStatus] = useState("UPCOMING");
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  
  const timeoutRef = useRef(null);

  const clearTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    return clearTimeouts;
  }, []);

  const runStep = (nextState, duration, nextStepCallback) => {
    setSimulationState(nextState);
    setStepStatus("ACTIVE");
    
    timeoutRef.current = setTimeout(() => {
      setStepStatus("COMPLETING");
      // Wait for checkmark drawing
      timeoutRef.current = setTimeout(() => {
        nextStepCallback();
      }, 600);
    }, duration);
  };

  const startSimulation = () => {
    clearTimeouts();
    setMetrics(DISRUPTED_METRICS);
    
    // Detecting: 2s -> Evaluating: 3s -> Rerouting: 4s -> Resolved
    runStep("DETECTING", 2000, () => {
      runStep("EVALUATING", 3000, () => {
        runStep("REROUTING", 4000, () => {
          setSimulationState("RESOLVED");
          setStepStatus("COMPLETED");
          
          // Wait briefly before showing final metrics to align with 'resolved' state
          timeoutRef.current = setTimeout(() => {
             setMetrics(RESOLVED_METRICS);
          }, 500);
        });
      });
    });
  };

  const resetSimulation = () => {
    clearTimeouts();
    setSimulationState("IDLE");
    setStepStatus("UPCOMING");
    setMetrics(INITIAL_METRICS);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Header section with Simulation Controls */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              TextileMesh AI Command Center
            </h1>
            <p className="text-[14px] text-slate-500">
              Real-time view of your textile operations. Here's what's happening across your units right now.
            </p>
          </div>
          <SimulationControls 
            onStart={startSimulation} 
            onReset={resetSimulation} 
            simulationState={simulationState} 
          />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <MetricCards metrics={metrics} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <NetworkHealth metrics={metrics} />
          </div>
        </div>

        {/* AI & Disruption Row */}
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-8">
             <AIResponsePipeline simulationState={simulationState} stepStatus={stepStatus} />
          </div>
          <div className="col-span-12 lg:col-span-4">
             {simulationState !== "IDLE" && (
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
                      {simulationState === "RESOLVED" ? "Recent Event" : "Active Disruption"}
                    </h2>
                  </div>
                </div>
             )}
             <ActiveDisruption simulationState={simulationState} />
          </div>
        </div>
      </div>
    </div>
  );
}
