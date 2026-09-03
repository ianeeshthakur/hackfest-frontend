"use client";

import React from "react";
import { MetricCards } from "./MetricCards";
import { NetworkHealth } from "./NetworkHealth";
import { ActiveDisruption } from "./ActiveDisruption";
import { AIResponsePipeline } from "./AIResponsePipeline";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { SimulationControls } from "./SimulationControls";
import { useDisruption } from "@/lib/disruptionContext";

export function CommandCenter() {
  const { 
    simulationState, 
    stepStatus, 
    currentConfig, 
    triggerDisruption, 
    resetDisruption 
  } = useDisruption();

  const startSimulation = () => triggerDisruption("Power Cut");
  const resetSimulation = () => resetDisruption();

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Active Disruption Banner */}
        {currentConfig && simulationState !== "IDLE" && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-center shadow-sm animate-fade-in-up">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 mr-4 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-20"></span>
              🔴
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-red-900 tracking-tight flex items-center gap-2">
                ACTIVE DISRUPTION: {currentConfig.title}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                  {currentConfig.severity}
                </span>
              </h2>
              <p className="text-[13px] text-red-800/80 font-medium mt-0.5">
                {currentConfig.confidence}% confidence • {currentConfig.ordersAffected} {currentConfig.ordersAffected === 1 ? 'order' : 'orders'} affected • +{currentConfig.delayHours}h expected delay
              </p>
            </div>
          </div>
        )}

        {/* Header section with Simulation Controls */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              ThreadLine Command Center
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
            <MetricCards />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <NetworkHealth />
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
             <AIRecommendationCard simulationState={simulationState} />
          </div>
        </div>
      </div>
    </div>
  );
}
