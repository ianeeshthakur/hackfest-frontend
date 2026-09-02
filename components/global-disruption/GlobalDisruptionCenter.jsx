import React from "react";
import { useDisruption } from "@/lib/disruptionContext";
import { AlertTriangle, Clock, TrendingUp, Activity, Package, Route, ActivitySquare, Sparkles } from "lucide-react";
import { NetworkImpactVisualizer } from "./NetworkImpactVisualizer";
import { DisruptionPropagation } from "./DisruptionPropagation";
import { RecoveryRecommendations } from "./RecoveryRecommendations";
import { RecentEventPanel } from "./RecentEventPanel";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";

export function GlobalDisruptionCenter() {
  const { currentConfig, simulationState } = useDisruption();

  const isIdle = !currentConfig || simulationState === "IDLE";
  
  // Default values if no disruption
  const activeEvent = isIdle ? null : currentConfig;
  
  // Dynamic UI based on disruption type
  const getDisruptionSpecifics = () => {
    if (isIdle) return null;
    
    switch (activeEvent.type) {
      case "powerCut":
        return {
          title: "POWER CUT",
          subtitle: "Grid power failure in Sector 4",
          metrics: { units: 4200, capacityLost: 18, expectedDelay: 4 }
        };
      case "machineBreakdown":
        return {
          title: "MACHINE BREAKDOWN",
          subtitle: "Spinning Line 3 unavailable",
          metrics: { units: 7800, capacityLost: 31, expectedDelay: 8 }
        };
      case "workerShortage":
        return {
          title: "WORKER SHORTAGE",
          subtitle: "Severe worker shortage (25% absenteeism)",
          metrics: { units: 5600, capacityLost: 24, expectedDelay: 6 }
        };
      case "rawMaterialDelay":
        return {
          title: "RAW MATERIAL DELAY",
          subtitle: "Delay from Supplier T-4",
          metrics: { units: 11200, capacityLost: 37, expectedDelay: 12 }
        };
      case "logisticsDelay":
        return {
          title: "PORT DELAY",
          subtitle: "Transit delay on critical shipment route",
          metrics: { units: 15000, capacityLost: 0, expectedDelay: 48 }
        };
      default:
        return {
          title: "UNKNOWN DISRUPTION",
          subtitle: "System anomaly detected",
          metrics: { units: 0, capacityLost: 0, expectedDelay: 0 }
        };
    }
  };

  const specifics = getDisruptionSpecifics();

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-8 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">Global Disruption Control Center</h1>
            <p className="text-slate-500 mt-2 font-medium">Real-time visibility into disruption propagation, operational impact and recovery.</p>
          </div>
          
          {specifics && (
            <div className="flex gap-4 items-center">
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-right">
                <div className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Active Event</div>
                <div className="text-sm font-bold text-red-700">{specifics.title} DETECTED</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Case ID</div>
                <div className="text-sm font-bold text-slate-700">TL-{Math.floor(Math.random() * 9000) + 1000}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Severity</div>
                <div className="text-sm font-bold text-red-600 uppercase">{activeEvent.severity || "HIGH"}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Confidence</div>
                <div className="text-sm font-bold text-slate-700">{activeEvent.confidence || 88}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col gap-6 flex-1">
        {isIdle ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 bg-white border border-slate-200 border-dashed rounded-xl p-12 shadow-sm">
            <ActivitySquare className="h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">No Active Disruptions</h2>
            <p className="text-sm text-slate-500 mt-2 text-center max-w-md">The global supply network is operating normally. Navigate to the Factory Dashboard to simulate a disruption and view the propagation analysis here.</p>
          </div>
        ) : (
          <div className="flex gap-6 h-full">
            {/* Left Column */}
            <div className="flex flex-col gap-6 flex-1 h-full">
              {/* Network / Global Impact Visualization Placeholder */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] relative overflow-hidden flex flex-col">
                <div className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-4">
                  <Route className="h-4 w-4 text-indigo-500" />
                  Network Impact Visualization
                </div>
                <div className="flex-1 w-full relative">
                  <NetworkImpactVisualizer activeEvent={activeEvent} />
                </div>
              </div>

              {/* Live Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Package className="h-3.5 w-3.5" /> Affected Units
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{specifics.metrics.units.toLocaleString()}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" /> Capacity Lost
                  </div>
                  <div className="text-2xl font-bold text-red-600">-{specifics.metrics.capacityLost}%</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Expected Delay
                  </div>
                  <div className="text-2xl font-bold text-amber-600">+{specifics.metrics.expectedDelay}h</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5" /> Risk Score
                  </div>
                  <ExplainableRiskScore score={activeEvent.riskScore} className="mt-1" />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="w-[400px] flex flex-col gap-6 shrink-0 h-full">
              {/* Disruption Propagation Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex-1">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Disruption Propagation
                </h3>
                <DisruptionPropagation activeEvent={activeEvent} />
              </div>
              
              {/* Recovery Section */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm flex-1">
                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  AI Recommended Response
                </h3>
                <RecoveryRecommendations activeEvent={activeEvent} />
              </div>
              
              {/* Recent Event Panel */}
              <RecentEventPanel activeEvent={activeEvent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
