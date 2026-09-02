"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { simulateDisruption } from "./clusterData";

const DisruptionContext = createContext(null);

export const disruptionConfigs = {
  powerCut: {
    type: "powerCut",
    title: "POWER OUTAGE DETECTED",
    severity: "HIGH",
    description: "Grid power interruption affecting production capacity.",
    riskScore: 72,
    confidence: 91,
    delayHours: 9,
    totalUnits: 50000,
    availableUnits: 32000, // currentCapacity
    affectedUnits: 18000, // lostCapacity
    unitsAtRisk: 4500, // orderExposure
    ordersAffected: 3,
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Evaluating",
      action: "Capacity Reallocation",
      resolved: "Monitoring" // Wait, user said: "Power Cut: Detecting -> Evaluating -> Capacity Reallocation -> Resolved" 
      // Actually user said: "Detecting -> Evaluating -> Capacity Reallocation -> Resolved" in Section 8. 
    },
    timeline: {
      detecting: "Power interruption detected",
      evaluating: "Calculating production capacity impact",
      action: "Identifying available production capacity",
      resolved: "Affected orders reassigned"
    },
    subSteps: {
      detecting: ["Heartbeat checked", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "Capacity impact calculating", "Risk score calculated"],
      action: ["Find available factories", "Compare capacity", "Match process", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },
    aiResponse: "Production capacity reduced due to a power availability disruption. Downstream orders are being evaluated for delay exposure.",
    powerStatus: "DISRUPTED",
    buyerView: {
      title: "PRODUCTION DELAY RISK",
      description: "Your order may arrive later than planned."
    },
    recovery: {
      availableUnits: 44000,
      affectedUnits: 6000,
      unitsAtRisk: 1000,
      riskScore: 38,
      delayHours: 2
    },
    riskFactors: [
      { label: "Production impact", value: 28 },
      { label: "Delivery proximity", value: 20 },
      { label: "Capacity reduction", value: 14 },
      { label: "Inventory exposure", value: 6 },
      { label: "Network dependency", value: 4 }
    ]
  },

  machineBreakdown: {
    type: "machineBreakdown",
    title: "MACHINE BREAKDOWN DETECTED",
    severity: "MEDIUM-HIGH",
    description: "Critical weaving equipment is unavailable.",
    riskScore: 61,
    confidence: 88,
    delayHours: 6,
    totalUnits: 50000,
    availableUnits: 41000,
    affectedUnits: 9000,
    unitsAtRisk: 2200,
    ordersAffected: 2,
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Evaluating",
      action: "Maintenance Recovery",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Machine telemetry anomaly detected",
      evaluating: "Calculating machine capacity loss",
      action: "Searching for alternate production equipment",
      resolved: "Production shifted to available capacity"
    },
    subSteps: {
      detecting: ["Telemetry anomaly detected", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "Capacity loss calculating", "Risk score calculated"],
      action: ["Find alternate equipment", "Compare capacity", "Match process", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },
    aiResponse: "Production has been constrained by a machine interruption. Available production capacity is being reassigned to protect priority orders.",
    machineStatus: "OFFLINE",
    buyerView: {
      title: "PRODUCTION DELAY RISK",
      description: "Your order may arrive later than planned."
    },
    recovery: {
      availableUnits: 48000,
      affectedUnits: 2000,
      unitsAtRisk: 500,
      riskScore: 32,
      delayHours: 1
    },
    riskFactors: [
      { label: "Production impact", value: 30 },
      { label: "Delivery proximity", value: 15 },
      { label: "Capacity reduction", value: 10 },
      { label: "Maintenance delay", value: 6 }
    ]
  },

  workerShortage: {
    type: "workerShortage",
    title: "WORKER SHORTAGE DETECTED",
    severity: "MEDIUM",
    description: "Workforce availability has fallen below planned production requirements.",
    riskScore: 28,
    confidence: 88,
    delayHours: 1,
    totalUnits: 50000,
    availableUnits: 46000,
    affectedUnits: 4000,
    unitsAtRisk: 500,
    ordersAffected: 1,
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Evaluating",
      action: "Rescheduling",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Workforce availability analyzed",
      evaluating: "Calculating production capacity impact",
      action: "Optimizing production shifts",
      resolved: "Orders rescheduled across available capacity"
    },
    subSteps: {
      detecting: ["Availability analyzed", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "Capacity impact calculating", "Risk score calculated"],
      action: ["Optimize shifts", "Compare capacity", "Match process", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },
    aiResponse: "Reduced workforce availability has constrained production. Orders are being rescheduled across available capacity.",
    workerAvailability: "76%",
    buyerView: {
      title: "PRODUCTION DELAY RISK",
      description: "Your order may arrive later than planned."
    },
    recovery: {
      availableUnits: 49000,
      affectedUnits: 1000,
      unitsAtRisk: 0,
      riskScore: 12,
      delayHours: 0
    },
    riskFactors: [
      { label: "Production impact", value: 10 },
      { label: "Delivery proximity", value: 7 },
      { label: "Capacity reduction", value: 6 },
      { label: "Network dependency", value: 5 }
    ]
  },

  rawMaterialDelay: {
    type: "rawMaterialDelay",
    title: "RAW MATERIAL DELAY DETECTED",
    severity: "MEDIUM",
    description: "Upstream yarn/material shipment has been delayed.",
    riskScore: 58,
    confidence: 90,
    delayHours: 5,
    totalUnits: 50000,
    availableUnits: 38000,
    affectedUnits: 12000,
    unitsAtRisk: 3200,
    ordersAffected: 2,
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Evaluating",
      action: "Supplier Recovery",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Supplier shipment delay detected",
      evaluating: "Checking inventory and production impact",
      action: "Identifying alternate material suppliers",
      resolved: "Alternate material source activated"
    },
    subSteps: {
      detecting: ["Shipment delay detected", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Inventory checked", "Production impact calculating", "Risk score calculated"],
      action: ["Identify alternate suppliers", "Compare availability", "Match quality", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },
    aiResponse: "Material availability has fallen below the required production threshold. Supplier recovery and inventory alternatives are being evaluated.",
    materialAvailability: "68%",
    inventoryCoverage: "2.4 DAYS",
    buyerView: {
      title: "PRODUCTION DELAY RISK",
      description: "Your order may arrive later than planned."
    },
    recovery: {
      availableUnits: 45000,
      affectedUnits: 5000,
      unitsAtRisk: 1200,
      riskScore: 28,
      delayHours: 1
    },
    riskFactors: [
      { label: "Supplier dependency", value: 25 },
      { label: "Inventory exposure", value: 18 },
      { label: "Production delay", value: 10 },
      { label: "Network impact", value: 5 }
    ]
  },

  logisticsDelay: {
    type: "logisticsDelay",
    title: "LOGISTICS DISRUPTION DETECTED",
    severity: "HIGH",
    description: "Transit delay on critical shipment route.",
    riskScore: 64,
    confidence: 85,
    delayHours: 7,
    totalUnits: 50000,
    availableUnits: 47000,
    affectedUnits: 3000,
    unitsAtRisk: 6800,
    ordersAffected: 2,
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Evaluating",
      action: "Route Optimization",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Logistics delay detected",
      evaluating: "Calculating shipment ETA impact",
      action: "Identifying alternate routes",
      resolved: "Shipment rerouted"
    },
    subSteps: {
      detecting: ["Logistics delay detected", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "ETA impact calculating", "Risk score calculated"],
      action: ["Identify alternate routes", "Compare logistics", "Match timeline", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },
    aiResponse: "A logistics delay has affected shipment timing. Alternative routing and delivery windows are being evaluated.",
    buyerView: {
      title: "DELIVERY DELAY RISK",
      description: "Your shipment may arrive later than planned."
    },
    recovery: {
      availableUnits: 49000,
      affectedUnits: 1000,
      unitsAtRisk: 500,
      riskScore: 30,
      delayHours: 2
    },
    riskFactors: [
      { label: "Transit delay", value: 30 },
      { label: "Delivery proximity", value: 20 },
      { label: "Route availability", value: 10 },
      { label: "Network impact", value: 4 }
    ]
  }
};

export function DisruptionProvider({ children }) {
  const [activeDisruption, setActiveDisruption] = useState(null);
  const [simulationState, setSimulationState] = useState("IDLE");
  const [stepStatus, setStepStatus] = useState("UPCOMING");
  
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(-1);
  const [subStepStatus, setSubStepStatus] = useState("UPCOMING");

  const timeoutRef = useRef(null);
  const stepTimeoutRef = useRef(null);

  const clearTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
  };

  useEffect(() => {
    return clearTimeouts;
  }, []);

  const runSubStepsSeq = async (subStepsArray) => {
    return new Promise((resolve) => {
      if (!subStepsArray || subStepsArray.length === 0) {
        resolve();
        return;
      }
      
      let index = 0;
      
      const nextSubStep = () => {
        if (index >= subStepsArray.length) {
          resolve();
          return;
        }
        
        setCurrentSubStepIndex(index);
        setSubStepStatus("ACTIVE");
        
        timeoutRef.current = setTimeout(() => {
          setSubStepStatus("COMPLETED");
          
          stepTimeoutRef.current = setTimeout(() => {
            index++;
            nextSubStep();
          }, 400); 
        }, 1200); 
      };
      
      nextSubStep();
    });
  };

  const runMainStep = async (stateKey, config) => {
    setSimulationState(stateKey);
    setStepStatus("ACTIVE");
    setCurrentSubStepIndex(-1);
    setSubStepStatus("UPCOMING");
    
    const subSteps = config.subSteps[stateKey.toLowerCase()] || [];
    await runSubStepsSeq(subSteps);
    
    setStepStatus("COMPLETING");
    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(() => {
        resolve();
      }, 600);
    });
  };

  const TYPE_MAP = {
    "Power Cut": "powerCut",
    "Machine Breakdown": "machineBreakdown",
    "Worker Shortage": "workerShortage",
    "Raw Material Delay": "rawMaterialDelay",
    "Logistics Delay": "logisticsDelay"
  };

  const triggerDisruption = (typeDisplay) => {
    const key = TYPE_MAP[typeDisplay];
    if (!key) return;

    simulateDisruption("F-013", typeDisplay);
    setActiveDisruption(key);
    
    clearTimeouts();
    setSimulationState("IDLE");
    setStepStatus("UPCOMING");
    setCurrentSubStepIndex(-1);
    setSubStepStatus("UPCOMING");
    
    const config = disruptionConfigs[key];
    
    setTimeout(async () => {
      await runMainStep("DETECTING", config);
      await runMainStep("EVALUATING", config);
      await runMainStep("ACTION", config);
      
      setSimulationState("RESOLVED");
      setStepStatus("ACTIVE");
      setCurrentSubStepIndex(-1);
      setSubStepStatus("UPCOMING");
      await runSubStepsSeq(config.subSteps.resolved || []);
      setStepStatus("COMPLETED");
    }, 50);
  };

  const resetDisruption = () => {
    simulateDisruption("F-013", "RESET");
    setActiveDisruption(null);
    setSimulationState("IDLE");
    setStepStatus("UPCOMING");
    setCurrentSubStepIndex(-1);
    setSubStepStatus("UPCOMING");
    clearTimeouts();
  };

  const currentConfig = activeDisruption ? disruptionConfigs[activeDisruption] : null;

  return (
    <DisruptionContext.Provider value={{
      activeDisruption,
      simulationState,
      stepStatus,
      currentConfig,
      triggerDisruption,
      resetDisruption,
      currentSubStepIndex,
      subStepStatus
    }}>
      {children}
    </DisruptionContext.Provider>
  );
}

export function useDisruption() {
  const context = useContext(DisruptionContext);
  if (!context) {
    throw new Error("useDisruption must be used within a DisruptionProvider");
  }
  return context;
}
