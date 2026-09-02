"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { simulateDisruption } from "./clusterData";

const DisruptionContext = createContext(null);

export const disruptionConfigs = {
  powerCut: {
    type: "powerCut",
    title: "POWER CUT DETECTED",
    severity: "HIGH",
    description: "Grid power interruption affecting production capacity.",
    riskScore: 72,
    confidence: 94,
    delayHours: 9,
    totalUnits: 50000,
    availableUnits: 36000,
    affectedUnits: 14000,
    unitsAtRisk: 12000,
    ordersAffected: 2,
    timeline: {
      detecting: "Power interruption detected",
      evaluating: "Calculating production capacity impact",
      rerouting: "Identifying available production capacity",
      mitigated: "Affected orders reassigned"
    },
    aiResponse: "Grid power interruption has reduced production capacity. ThreadLine has identified available alternate production capacity and is evaluating affected orders for recovery.",
    // Metric variants
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
    }
  },

  machineBreakdown: {
    type: "machineBreakdown",
    title: "MACHINE BREAKDOWN DETECTED",
    severity: "MEDIUM-HIGH",
    description: "Critical weaving equipment is unavailable.",
    riskScore: 64,
    confidence: 91,
    delayHours: 7,
    totalUnits: 50000,
    availableUnits: 35000,
    affectedUnits: 15000,
    unitsAtRisk: 13000,
    ordersAffected: 2,
    timeline: {
      detecting: "Machine telemetry anomaly detected",
      evaluating: "Calculating machine capacity loss",
      rerouting: "Searching for alternate production equipment",
      mitigated: "Production shifted to available capacity"
    },
    aiResponse: "A critical production machine is offline. ThreadLine has identified available alternate production capacity and is reallocating affected production.",
    machineStatus: "OFFLINE",
    buyerView: {
      title: "PRODUCTION DELAY RISK",
      description: "Your order may arrive later than planned."
    },
    recovery: {
      availableUnits: 42000,
      affectedUnits: 8000,
      unitsAtRisk: 2000,
      riskScore: 35,
      delayHours: 3
    }
  },

  workerShortage: {
    type: "workerShortage",
    title: "WORKER SHORTAGE DETECTED",
    severity: "MEDIUM",
    description: "Workforce availability has fallen below planned production requirements.",
    riskScore: 58,
    confidence: 88,
    delayHours: 6,
    totalUnits: 50000,
    availableUnits: 40000,
    affectedUnits: 10000,
    unitsAtRisk: 8500,
    ordersAffected: 1,
    timeline: {
      detecting: "Workforce availability analyzed",
      evaluating: "Calculating production capacity impact",
      rerouting: "Optimizing production shifts",
      mitigated: "Orders rescheduled across available capacity"
    },
    aiResponse: "Workforce availability has dropped below the required production level. ThreadLine is optimizing production allocation and rescheduling affected orders.",
    workerAvailability: "76%",
    buyerView: {
      title: "PRODUCTION DELAY RISK",
      description: "Your order may arrive later than planned."
    },
    recovery: {
      availableUnits: 46000,
      affectedUnits: 4000,
      unitsAtRisk: 500,
      riskScore: 28,
      delayHours: 1
    }
  },

  rawMaterialDelay: {
    type: "rawMaterialDelay",
    title: "RAW MATERIAL DELAY DETECTED",
    severity: "MEDIUM",
    description: "Upstream yarn/material shipment has been delayed.",
    riskScore: 61,
    confidence: 90,
    delayHours: 8,
    totalUnits: 50000,
    availableUnits: 34000,
    affectedUnits: 16000,
    unitsAtRisk: 14000,
    ordersAffected: 2,
    timeline: {
      detecting: "Supplier shipment delay detected",
      evaluating: "Checking inventory and production impact",
      rerouting: "Identifying alternate material suppliers",
      mitigated: "Alternate material source activated"
    },
    aiResponse: "An upstream material shipment has been delayed and available inventory is insufficient to maintain the current production schedule. ThreadLine has identified alternate suppliers and is evaluating replacement capacity.",
    materialAvailability: "68%",
    inventoryCoverage: "1.8 DAYS",
    buyerView: {
      title: "PRODUCTION DELAY RISK",
      description: "Your order may arrive later than planned."
    },
    recovery: {
      availableUnits: 41000,
      affectedUnits: 9000,
      unitsAtRisk: 3000,
      riskScore: 32,
      delayHours: 2
    }
  }
};

export function DisruptionProvider({ children }) {
  const [activeDisruption, setActiveDisruption] = useState(null);
  const [simulationState, setSimulationState] = useState("IDLE");
  const [stepStatus, setStepStatus] = useState("UPCOMING");

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
      timeoutRef.current = setTimeout(() => {
        nextStepCallback();
      }, 600);
    }, duration);
  };

  // Maps UI display string to internal key
  const TYPE_MAP = {
    "Power Cut": "powerCut",
    "Machine Breakdown": "machineBreakdown",
    "Worker Shortage": "workerShortage",
    "Raw Material Delay": "rawMaterialDelay"
  };

  const triggerDisruption = (typeDisplay) => {
    const key = TYPE_MAP[typeDisplay];
    if (!key) return;

    // Mutate cluster map data (Suresh Textiles Tiruppur)
    simulateDisruption("F-013", typeDisplay);

    setActiveDisruption(key);
    clearTimeouts();
    
    runStep("DETECTING", 2000, () => {
      runStep("EVALUATING", 3000, () => {
        runStep("REROUTING", 4000, () => {
          setSimulationState("RESOLVED");
          setStepStatus("COMPLETED");
        });
      });
    });
  };

  const resetDisruption = () => {
    simulateDisruption("F-013", "RESET");
    setActiveDisruption(null);
    setSimulationState("IDLE");
    setStepStatus("UPCOMING");
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
