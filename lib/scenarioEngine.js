// lib/scenarioEngine.js

// Maps text representations of numbers to integers
const wordToNumber = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, twenty: 20
};

export function parseScenarioIntent(query) {
  const q = query.toLowerCase();
  
  // Check if it's a hypothetical question
  const isHypothetical = q.includes("what if") || q.includes("suppose") || q.includes("what happens") || q.includes("if we");
  if (!isHypothetical) return null;

  const params = {
    duration: null,
    action: null,
    capacityChange: null,
    cost: null,
    isComparison: false
  };

  // 1. Extract Duration (e.g., "5 hours", "5h", "five hours")
  const durationMatch = q.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(hours?|hrs?|h)\b/);
  if (durationMatch) {
    const val = durationMatch[1];
    params.duration = isNaN(val) ? wordToNumber[val] : parseInt(val, 10);
  }

  // 2. Extract Action
  if (q.includes("do nothing") || q.includes("wait") || q.includes("no action") || q.includes("don't intervene")) {
    params.action = "WAIT";
  } else if (q.includes("reroute") || q.includes("re-route")) {
    params.action = "REROUTE";
  } else if (q.includes("split")) {
    params.action = "SPLIT";
  }

  // 3. Extract Capacity Change (e.g., "20% capacity loss", "lose another 20%")
  const capacityMatch = q.match(/(\d+)%\s*(capacity)?/);
  if (capacityMatch) {
    params.capacityChange = -parseInt(capacityMatch[1], 10);
  }

  // 4. Comparison check
  if (q.includes("vs") || q.includes("instead") || q.includes("difference between")) {
    params.isComparison = true;
    // If they asked "wait vs reroute", we need to run both.
    if (q.includes("wait") && q.includes("reroute")) {
      params.compareActions = ["WAIT", "REROUTE"];
    }
  }

  // 5. Multi-step sequence (e.g., "wait 4 hours and then reroute")
  // We'll simplify this by just setting duration and action if both exist.
  // The engine will apply the duration penalty THEN the action recovery.

  return params;
}

export function simulateScenario(currentConfig, params) {
  if (!currentConfig) return null;

  // Base state
  const baseRisk = currentConfig.riskScore;
  const baseDelay = currentConfig.delayHours;
  const baseOrders = currentConfig.ordersAffected;
  let baseCapacityPct = Math.round((currentConfig.availableUnits / currentConfig.totalUnits) * 100);

  // Helper to simulate a specific action
  const simulateAction = (actionStr, dur) => {
    let r = baseRisk;
    let d = baseDelay;
    let c = baseCapacityPct;
    let o = baseOrders;
    let costVal = 0;
    let conf = currentConfig.confidence;

    if (dur) {
      r += Math.round(dur * 1.5);
      if (actionStr !== "REROUTE") d = dur;
      if (dur > 4) o += 1;
      c = Math.max(10, c - Math.round(dur * 1.2));
    }

    if (params.capacityChange) {
      c += params.capacityChange;
      r += Math.abs(params.capacityChange);
      d += Math.round(Math.abs(params.capacityChange) / 10);
    }

    if (actionStr === "REROUTE") {
      r = currentConfig.recovery?.riskScore || 24;
      d = currentConfig.recovery?.delayHours || 2;
      costVal = 18500;
      conf = 88;
      o = Math.max(0, o - 1);
      c = 95;
    } else if (actionStr === "SPLIT") {
      r = Math.round(baseRisk * 0.7);
      d = Math.max(1, baseDelay - 2);
      costVal = 12000;
      conf = 82;
    }

    return {
      risk: Math.min(100, Math.max(0, r)),
      delay: d,
      capacityPct: Math.min(100, Math.max(0, c)),
      ordersAtRisk: o,
      cost: costVal,
      confidence: conf
    };
  };

  if (params.isComparison) {
    const actionsToCompare = params.compareActions || ["WAIT", "REROUTE"];
    const results = actionsToCompare.map(a => ({
      name: a,
      ...simulateAction(a, params.duration)
    }));

    return {
      params,
      isComparison: true,
      comparisons: results,
      assumptions: [
        `Comparing scenarios: ${actionsToCompare.join(" vs ")}`,
        `Current order progress: 72%`,
        params.duration ? `Estimated disruption duration: ${params.duration}h` : "Standard recovery time estimate"
      ]
    };
  }

  // Single scenario path
  const projected = simulateAction(params.action, params.duration);
  projected.recommendedAction = "REROUTE";

  return {
    params,
    current: {
      risk: baseRisk,
      delay: baseDelay,
      capacityPct: baseCapacityPct,
      ordersAtRisk: baseOrders
    },
    projected,
    assumptions: [
      `Current factory capacity: ${baseCapacityPct}%`,
      `Current order progress: 72%`,
      params.duration ? `Estimated disruption duration: ${params.duration}h` : "Standard recovery time estimate",
      params.action === "WAIT" ? "No additional recovery action taken" : (params.action ? `Action executed: ${params.action}` : "Existing inventory remains available")
    ]
  };
}
