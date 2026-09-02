import re

def add_substeps(content):
    # Mapping of disruption type to subSteps dict string
    substeps_map = {
        "powerCut": """    subSteps: {
      detecting: ["Heartbeat checked", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "Capacity impact calculating", "Risk score calculated"],
      action: ["Find available factories", "Compare capacity", "Match process", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },""",
        "machineBreakdown": """    subSteps: {
      detecting: ["Telemetry anomaly detected", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "Capacity loss calculating", "Risk score calculated"],
      action: ["Find alternate equipment", "Compare capacity", "Match process", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },""",
        "workerShortage": """    subSteps: {
      detecting: ["Availability analyzed", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "Capacity impact calculating", "Risk score calculated"],
      action: ["Optimize shifts", "Compare capacity", "Match process", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },""",
        "rawMaterialDelay": """    subSteps: {
      detecting: ["Shipment delay detected", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Inventory checked", "Production impact calculating", "Risk score calculated"],
      action: ["Identify alternate suppliers", "Compare availability", "Match quality", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },""",
        "logisticsDelay": """    subSteps: {
      detecting: ["Logistics delay detected", "Signal verified", "Disruption detected"],
      evaluating: ["Orders identified", "Dependencies checked", "ETA impact calculating", "Risk score calculated"],
      action: ["Identify alternate routes", "Compare logistics", "Match timeline", "Generate recommendation"],
      resolved: ["Track recovery", "Verify outcome"]
    },"""
    }

    for key, substep_code in substeps_map.items():
        pattern = r"(" + key + r": \{.*?timeline: \{.*?\},)"
        # Use regex to find the 'timeline: {...}' and insert subSteps right after it.
        # We need to make sure we don't match greedy across multiple configs.
        content = re.sub(
            r'(' + key + r': \{.*?timeline: \{[^}]*\},)',
            r'\1\n' + substep_code,
            content,
            flags=re.DOTALL
        )
    return content

provider_code = """export function DisruptionProvider({ children }) {
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
"""

with open("scratch/disruptionContext.js", "r") as f:
    content = f.read()

content = add_substeps(content)

# Replace the provider
content = re.sub(r'export function DisruptionProvider.*', provider_code, content, flags=re.DOTALL)

with open("lib/disruptionContext.jsx", "w") as f:
    f.write(content)

print("Context successfully patched!")
