"use client";

import React, { useState, useEffect, useRef } from "react";
import { LogisticsHeader } from "@/components/global-logistics/LogisticsHeader";
import { MetricCards } from "@/components/global-logistics/MetricCards";
import { RouteBoard } from "@/components/global-logistics/RouteBoard";
import { NetworkWatch } from "@/components/global-logistics/NetworkWatch";
import { PortStatus } from "@/components/global-logistics/PortStatus";
import { METRICS } from "@/lib/globalLogisticsData";
import { RoleGuard } from "@/components/ui/RoleGuard";

export default function GlobalLogisticsPage() {
  const [simState, setSimState] = useState("IDLE");
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentNodeId, setCurrentNodeId] = useState("tiruppur");
  const [metrics, setMetrics] = useState({
    inTransit: METRICS.initialInTransit,
    portExposure: 0,
    routeHealth: METRICS.initialRouteHealth
  });

  const timerRef = useRef(null);

  const startSimulation = () => {
    if (simState !== "IDLE") return;
    setSimState("MOVING_TO_NHAVA");
    setProgressPercent(25);
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    switch (simState) {
      case "MOVING_TO_NHAVA":
        // Ship takes 1.5s to reach 25%
        timerRef.current = setTimeout(() => {
          setSimState("DISRUPTION_DETECTED");
        }, 1500);
        break;
        
      case "DISRUPTION_DETECTED":
        setCurrentNodeId("nhava_sheva");
        setMetrics(m => ({ ...m, portExposure: 4, routeHealth: 55.8 }));
        timerRef.current = setTimeout(() => {
          setSimState("ANALYZING");
        }, 2000);
        break;
        
      case "ANALYZING":
        timerRef.current = setTimeout(() => {
          setSimState("ALTERNATIVE_FOUND");
        }, 2500);
        break;
        
      case "ALTERNATIVE_FOUND":
        timerRef.current = setTimeout(() => {
          setSimState("REROUTING");
        }, 2000);
        break;
        
      case "REROUTING":
        setMetrics(m => ({ ...m, routeHealth: 71.6, portExposure: 0 }));
        timerRef.current = setTimeout(() => {
          setSimState("ARRIVED_MUNDRA"); // Rerouted to same 25% spot, trigger completion tick
          setCurrentNodeId("mundra");
        }, 1000);
        break;
        
      case "MOVING_TO_ARABIAN_SEA":
        timerRef.current = setTimeout(() => {
          setSimState("ARRIVED_ARABIAN_SEA");
          setCurrentNodeId("arabian_sea");
        }, 1500);
        break;
        
      case "MOVING_TO_SUEZ":
        timerRef.current = setTimeout(() => {
          setSimState("ARRIVED_SUEZ");
          setCurrentNodeId("suez_canal");
        }, 1500);
        break;
        
      case "MOVING_TO_HAMBURG":
        timerRef.current = setTimeout(() => {
          setSimState("DELIVERED");
          setCurrentNodeId("hamburg");
        }, 1500);
        break;
    }
    
    return () => clearTimeout(timerRef.current);
  }, [simState]);

  const handleCheckpointComplete = (nodeId) => {
    // When the tick animation finishes, we move to the next state
    if (nodeId === "mundra") {
      setSimState("MOVING_TO_ARABIAN_SEA");
      setProgressPercent(50);
    } else if (nodeId === "arabian_sea") {
      setSimState("MOVING_TO_SUEZ");
      setProgressPercent(75);
    } else if (nodeId === "suez_canal") {
      setSimState("MOVING_TO_HAMBURG");
      setProgressPercent(100);
    }
  };

  return (
    <RoleGuard allowedRole="owner">
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <LogisticsHeader onSimulateDisruption={startSimulation} simState={simState} />
      
      <div className="flex-1 overflow-y-auto">
        <MetricCards metrics={metrics} />
        
        <div className="px-8 pb-8 flex gap-6">
          {/* Main Route Board */}
          <div className="flex-grow w-2/3">
            <RouteBoard 
              simState={simState} 
              progressPercent={progressPercent} 
              onCheckpointComplete={handleCheckpointComplete}
              currentNodeId={currentNodeId}
            />
          </div>
          
          {/* Right Sidebar */}
          <div className="w-1/3 flex flex-col min-w-[320px]">
            <NetworkWatch simState={simState} />
            <PortStatus simState={simState} />
          </div>
        </div>
      </div>
    </div>
    </RoleGuard>
  );
}