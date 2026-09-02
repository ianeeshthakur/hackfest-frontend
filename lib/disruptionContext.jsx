"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { simulateDisruption } from "./clusterData";

const DisruptionContext = createContext(null);

export const disruptionConfigs = {
  powerCut: {
    category: "FACTORY",
    type: "powerCut",
    title: "POWER OUTAGE DETECTED",
    subtitle: "Grid power failure in Sector 4",
    severity: "HIGH",
    description: "Grid power interruption affecting production capacity.",
    riskScore: 72,
    confidence: 91,
    delayHours: 9,
    totalUnits: 50000,
    availableUnits: 32000,
    affectedUnits: 18000,
    unitsAtRisk: 4500,
    ordersAffected: 3,
    metrics: { units: 4200, capacityLost: 18, expectedDelay: 4 },
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Evaluating",
      action: "Capacity Reallocation",
      resolved: "Monitoring"
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
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
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
    category: "FACTORY",
    type: "machineBreakdown",
    title: "MACHINE BREAKDOWN DETECTED",
    subtitle: "Spinning Line 3 unavailable",
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
    metrics: { units: 7800, capacityLost: 31, expectedDelay: 8 },
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
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
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
    category: "FACTORY",
    type: "workerShortage",
    title: "WORKER SHORTAGE DETECTED",
    subtitle: "Severe worker shortage (25% absenteeism)",
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
    metrics: { units: 5600, capacityLost: 24, expectedDelay: 6 },
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
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
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
    category: "FACTORY",
    type: "rawMaterialDelay",
    title: "RAW MATERIAL DELAY DETECTED",
    subtitle: "Delay from Supplier T-4",
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
    metrics: { units: 11200, capacityLost: 37, expectedDelay: 12 },
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
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
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
    category: "FACTORY",
    type: "logisticsDelay",
    title: "LOGISTICS DISRUPTION DETECTED",
    subtitle: "Transit delay on critical shipment route",
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
    metrics: { units: 15000, capacityLost: 0, expectedDelay: 48 },
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
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
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

export const shipmentConfigs = {
  PORT_CONGESTION: {
    category: "SHIPMENT",
    type: "PORT_CONGESTION",
    title: "PORT CONGESTION DETECTED",
    subtitle: "Severe backlog at Port of Nhava Sheva",
    description: "Vessel berthing delayed by 5-7 days due to container backlog.",
    severity: "HIGH",
    riskScore: 82,
    confidence: 94,
    delayHours: 120, // 5 days
    metrics: { units: 15000, capacityLost: 0, expectedDelay: 120 },
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Impact Analysis",
      action: "Rerouting",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Port congestion detected at Nhava Sheva",
      evaluating: "Calculating downstream supply chain impact",
      action: "Identifying alternative port availability",
      resolved: "Shipment redirected to alternative port"
    },
    subSteps: {
      detecting: ["Port congestion detected", "Vessel tracking verified"],
      evaluating: ["Affected shipments identified", "ETA updated"],
      action: ["Evaluate alternative ports", "Check air freight options", "Notify customers"],
      resolved: ["Shipment rerouted", "Monitoring transit"]
    },
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
    recoveryOptions: [
      { title: "Reroute via Mundra Port", delay: "+24h", risk: 25, recommended: true },
      { title: "Air Freight Priority Units", delay: "+48h", risk: 40 },
      { title: "Wait for Berthing Window", delay: "+120h", risk: 80 }
    ],
    propagationSteps: [
      { text: "Nhava Sheva congestion detected", highlight: true },
      { text: "Vessel berthing delayed" },
      { text: "15,000 units delayed", highlight: true },
      { text: "Expected delay +120h" },
      { text: "Rerouting to alternate port", success: true }
    ],
    buyerView: {
      title: "SHIPMENT DELAY",
      description: "Port congestion is delaying your ocean freight."
    },
    recovery: {
      availableUnits: 0,
      affectedUnits: 15000,
      unitsAtRisk: 15000,
      riskScore: 45,
      delayHours: 48
    },
    riskFactors: [
      { label: "Transit delay", value: 35 },
      { label: "Network bottleneck", value: 25 },
      { label: "Inventory risk", value: 15 },
      { label: "Customer impact", value: 7 }
    ]
  },
  GEOPOLITICAL_EVENT: {
    category: "SHIPMENT",
    type: "GEOPOLITICAL_EVENT",
    title: "GEOPOLITICAL DISRUPTION",
    subtitle: "Suez Canal transit restricted",
    description: "Commercial vessels are being diverted around the Cape of Good Hope.",
    severity: "CRITICAL",
    riskScore: 95,
    confidence: 98,
    delayHours: 336, // 14 days
    metrics: { units: 45000, capacityLost: 0, expectedDelay: 336 },
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Impact Analysis",
      action: "Rerouting",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Geopolitical event restricted Suez transit",
      evaluating: "Analyzing cost and delay for Cape of Good Hope",
      action: "Initiating emergency logistics protocols",
      resolved: "Vessels rerouted successfully"
    },
    subSteps: {
      detecting: ["Geopolitical event detected", "Route restriction verified"],
      evaluating: ["Affected vessels identified", "ETA delay calculated"],
      action: ["Divert to Cape of Good Hope", "Recalculate logistics cost", "Notify buyers"],
      resolved: ["Vessels rerouted", "Monitoring new route"]
    },
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
    recoveryOptions: [
      { title: "Divert via Cape of Good Hope", delay: "+336h", risk: 40, recommended: true },
      { title: "Air Freight Critical Cargo", delay: "+72h", risk: 65 },
      { title: "Hold at Anchorage", delay: "TBD", risk: 90 }
    ],
    propagationSteps: [
      { text: "Suez Canal transit restricted", highlight: true },
      { text: "Global shipping lanes impacted" },
      { text: "45,000 units at risk", highlight: true },
      { text: "Expected delay +336h" },
      { text: "Diverting to Cape of Good Hope", success: true }
    ],
    buyerView: {
      title: "CRITICAL SHIPMENT DELAY",
      description: "Global route diversion is adding 14+ days to transit."
    },
    recovery: {
      availableUnits: 0,
      affectedUnits: 45000,
      unitsAtRisk: 45000,
      riskScore: 70,
      delayHours: 336
    },
    riskFactors: [
      { label: "Transit delay", value: 45 },
      { label: "Freight cost", value: 25 },
      { label: "Insurance premium", value: 15 },
      { label: "Inventory risk", value: 10 }
    ]
  },
  WEATHER_DISRUPTION: {
    category: "SHIPMENT",
    type: "WEATHER_DISRUPTION",
    title: "WEATHER DISRUPTION",
    subtitle: "Typhoon warning in South China Sea",
    description: "Vessel operations suspended for 48 hours.",
    severity: "MEDIUM",
    riskScore: 65,
    confidence: 90,
    delayHours: 48,
    metrics: { units: 20000, capacityLost: 0, expectedDelay: 48 },
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Impact Analysis",
      action: "Rescheduling",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Severe weather alert received",
      evaluating: "Estimating port closure duration",
      action: "Securing safe anchorage for vessels",
      resolved: "Voyage resumed post-storm"
    },
    subSteps: {
      detecting: ["Weather alert received", "Vessel proximity checked"],
      evaluating: ["Delay duration estimated", "Affected ports identified"],
      action: ["Hold vessel at safe anchorage", "Update delivery windows"],
      resolved: ["Weather cleared", "Voyage resumed"]
    },
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
    recoveryOptions: [
      { title: "Secure Safe Anchorage", delay: "+48h", risk: 15, recommended: true },
      { title: "Reroute around Storm System", delay: "+72h", risk: 35 },
      { title: "Proceed with Caution", delay: "+24h", risk: 85 }
    ],
    propagationSteps: [
      { text: "Typhoon warning issued", highlight: true },
      { text: "Port operations suspended" },
      { text: "20,000 units halted", highlight: true },
      { text: "Expected delay +48h" },
      { text: "Safe anchorage secured", success: true }
    ],
    buyerView: {
      title: "WEATHER DELAY",
      description: "Storms are causing minor transit delays."
    },
    recovery: {
      availableUnits: 0,
      affectedUnits: 20000,
      unitsAtRisk: 20000,
      riskScore: 30,
      delayHours: 48
    },
    riskFactors: [
      { label: "Transit delay", value: 40 },
      { label: "Port closure", value: 20 },
      { label: "Safety risk", value: 5 }
    ]
  },
  PORT_STRIKE: {
    category: "SHIPMENT",
    type: "PORT_STRIKE",
    title: "PORT STRIKE DETECTED",
    subtitle: "Dock workers strike at Hamburg",
    description: "Operations halted indefinitely. Cargo unloading impossible.",
    severity: "HIGH",
    riskScore: 88,
    confidence: 95,
    delayHours: 168,
    metrics: { units: 12000, capacityLost: 0, expectedDelay: 168 },
    timelineStages: {
      detecting: "Detecting",
      evaluating: "Impact Analysis",
      action: "Rerouting",
      resolved: "Resolved"
    },
    timeline: {
      detecting: "Labor strike initiated at destination port",
      evaluating: "Assessing hold duration and demurrage costs",
      action: "Diverting inbound vessels to alternative EU ports",
      resolved: "Cargo unloaded via alternative logistics"
    },
    subSteps: {
      detecting: ["Strike action confirmed", "Operations status verified"],
      evaluating: ["Inbound vessels identified", "Hold duration estimated"],
      action: ["Divert to alternative EU port", "Arrange overland transport"],
      resolved: ["Cargo unloaded", "Overland transit started"]
    },
    recoveryOptions: [
      { title: "Shift to Alternate Facility", delay: "+1h", risk: 15, recommended: true },
      { title: "Run on Backup Generators", delay: "+4h", risk: 45 },
      { title: "Wait for Grid Restoration", delay: "+8h", risk: 65 }
    ],
    propagationSteps: [
      { text: "Power failure halts Spinning Line", highlight: true },
      { text: "18% total capacity lost" },
      { text: "2 orders delayed", highlight: true },
      { text: "Expected restoration +4h" },
      { text: "Backup generators inadequate", success: false }
    ],
    recoveryOptions: [
      { title: "Divert to Port of Rotterdam", delay: "+72h", risk: 25, recommended: true },
      { title: "Wait for Strike Resolution", delay: "+168h", risk: 75 },
      { title: "Air Freight Ex-Factory", delay: "+48h", risk: 60 }
    ],
    propagationSteps: [
      { text: "Dock workers strike active", highlight: true },
      { text: "Cargo unloading halted" },
      { text: "12,000 units stuck", highlight: true },
      { text: "Expected delay +168h" },
      { text: "Overland transport initiated", success: true }
    ],
    buyerView: {
      title: "PORT STRIKE DELAY",
      description: "Labor strike is preventing cargo unloading."
    },
    recovery: {
      availableUnits: 0,
      affectedUnits: 12000,
      unitsAtRisk: 12000,
      riskScore: 50,
      delayHours: 72
    },
    riskFactors: [
      { label: "Unloading blocked", value: 40 },
      { label: "Demurrage costs", value: 25 },
      { label: "Transit delay", value: 15 },
      { label: "Inventory risk", value: 8 }
    ]
  }
};

export function DisruptionProvider({ children }) {
  // activeDisruption is now the full object config
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
    const config = disruptionConfigs[key];
    
    setActiveDisruption(config);
    
    clearTimeouts();
    setSimulationState("IDLE");
    setStepStatus("UPCOMING");
    setCurrentSubStepIndex(-1);
    setSubStepStatus("UPCOMING");
    
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

  const triggerShipmentDisruption = (type) => {
    const config = shipmentConfigs[type];
    if (!config) return;
    
    // Using a different mock target or tracking logic if needed
    simulateDisruption("GLOBAL_SHIPPING", type);
    
    setActiveDisruption(config);
    
    clearTimeouts();
    setSimulationState("IDLE");
    setStepStatus("UPCOMING");
    setCurrentSubStepIndex(-1);
    setSubStepStatus("UPCOMING");
    
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
    simulateDisruption("RESET", "RESET");
    setActiveDisruption(null);
    setSimulationState("IDLE");
    setStepStatus("UPCOMING");
    setCurrentSubStepIndex(-1);
    setSubStepStatus("UPCOMING");
    clearTimeouts();
  };

  // currentConfig is now an alias for activeDisruption since it holds the whole object
  const currentConfig = activeDisruption;

  return (
    <DisruptionContext.Provider value={{
      activeDisruption,
      simulationState,
      stepStatus,
      currentConfig,
      triggerDisruption,
      triggerShipmentDisruption,
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
