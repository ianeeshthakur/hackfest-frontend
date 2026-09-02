// lib/scenarioEngine.js

export function parseIntentAndParams(text) {
  const t = text.toLowerCase();
  
  // Is this a scenario question?
  const isScenario = t.includes("what if") || t.includes("suppose") || 
                     t.includes("what happens") || t.includes("if we") || t.includes("impact if") ||
                     t.includes("scenario");

  if (!isScenario) {
    return { isScenario: false };
  }

  // Extract parameters
  let duration = null;
  const hourRegex = /\b(\d+)\s*(?:hour|hours|h|hrs)\b/i;
  const match = t.match(hourRegex);
  if (match) {
    duration = parseInt(match[1], 10);
  }

  // Extract words for numbers like "five" or "ten"
  if (!duration) {
    const wordMap = { "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10 };
    for (const [word, num] of Object.entries(wordMap)) {
      if (t.includes(`${word} hour`) || t.includes(`${word} h`)) {
        duration = num;
        break;
      }
    }
  }

  let action = null; // "NONE", "REROUTE", "WAIT", "SPLIT"
  if (t.includes("reroute")) {
    action = "REROUTE";
  } else if (t.includes("do nothing") || t.includes("no action") || t.includes("don't intervene") || t.includes("wait") || t.includes("take no action")) {
    action = "WAIT"; // "WAIT" and "NONE" behave similarly
  } else if (t.includes("split")) {
    action = "SPLIT";
  }

  let capacityDrop = null;
  const capRegex = /\b(\d+)%\s*capacity\b/i;
  const capMatch = t.match(capRegex);
  if (capMatch) {
    capacityDrop = parseInt(capMatch[1], 10);
  }

  return {
    isScenario: true,
    params: {
      duration,
      action,
      capacityDrop
    }
  };
}

export function simulateScenario(activeDisruption, params, role) {
  // If no disruption is active, we can't simulate a context-aware scenario
  if (!activeDisruption) {
    return {
      error: "No active disruption to simulate against."
    };
  }

  const { duration, action, capacityDrop } = params;
  
  // Baseline values
  const baseRisk = activeDisruption.riskScore || 50;
  const baseDelay = activeDisruption.delayHours || 0;
  const baseCapacityLost = activeDisruption.metrics?.capacityLost || 0;
  const baseOrdersAffected = activeDisruption.ordersAffected || 1;
  
  // Projected values based on deterministic calculations
  let projRisk = baseRisk;
  let projDelay = baseDelay;
  let projCapacityLost = baseCapacityLost;
  let projOrdersAtRisk = baseOrdersAffected;
  let projCost = 0;
  let confidence = activeDisruption.confidence || 85;

  let explanation = "";
  let recommendedAction = "";
  let title = "SCENARIO SIMULATION";

  // Simulate duration impact (e.g. if duration is explicit or inferred)
  const simDuration = duration || baseDelay || 5; 

  // Action multipliers
  if (action === "REROUTE") {
    title = "REROUTE SCENARIO";
    projDelay = Math.max(0, simDuration - 3); // Rerouting saves time
    projRisk = Math.max(10, baseRisk - 40); // Massively drops risk
    projCost = 18500; // Simulated cost for rerouting
    confidence = 88;
    recommendedAction = "PROCEED WITH REROUTE";
    
    if (role === "owner") {
      explanation = `Rerouting incurs an estimated cost of ₹${projCost.toLocaleString()} but substantially reduces expected delay and fulfillment risk for the affected orders.`;
    } else {
      explanation = `Rerouting order volume to a secondary facility will significantly reduce the expected delay and protect your delivery commitment, though it requires splitting the shipment.`;
    }
  } else if (action === "WAIT" || action === "NONE") {
    title = "NO-ACTION SIMULATION";
    projDelay = simDuration + 4; // Doing nothing exacerbates the delay
    projRisk = Math.min(99, baseRisk + (simDuration * 3));
    projCapacityLost = baseCapacityLost + (capacityDrop || 5);
    projOrdersAtRisk += 1;
    confidence = 92;
    recommendedAction = "REROUTE IMMEDIATELY";

    if (role === "owner") {
      explanation = `Doing nothing allows the disruption to continue consuming the available production buffer. The main consequence is increasing deadline and fulfillment risk.`;
    } else {
      explanation = `If no intervention occurs, the disruption is projected to add further delays and increase fulfillment risk for your order. Action is required.`;
    }
  } else {
    // Just a general duration impact
    title = `${simDuration}-HOUR DISRUPTION SCENARIO`;
    projDelay = simDuration;
    projRisk = Math.min(99, baseRisk + (simDuration * 1.5));
    projCapacityLost = baseCapacityLost + (capacityDrop || (simDuration > 5 ? 10 : 0));
    projOrdersAtRisk = simDuration > 6 ? (baseOrdersAffected + 1) : baseOrdersAffected;
    confidence = 87;
    recommendedAction = "REROUTE";

    if (role === "owner") {
      explanation = `With a ${simDuration}-hour disruption, the current production buffer is unlikely to fully absorb the lost production time. The affected orders therefore move into higher deadline risk.`;
    } else {
      explanation = `Assuming the disruption continues for ${simDuration} hours, the order is projected to experience approximately +${projDelay}h additional delay and higher fulfillment risk.`;
    }
  }

  // Format the output specifically for the ScenarioCard
  return {
    isComparison: false,
    title,
    duration: simDuration,
    actionSimulated: action,
    current: {
      risk: baseRisk,
      capacityPct: Math.max(0, 100 - baseCapacityLost),
      ordersAtRisk: baseOrdersAffected
    },
    projected: {
      risk: Math.round(projRisk),
      delay: Math.round(projDelay),
      capacityPct: Math.max(0, 100 - Math.round(projCapacityLost)),
      ordersAtRisk: projOrdersAtRisk,
      cost: projCost,
      recommendedAction,
      confidence
    },
    explanation,
    assumptions: [
      `Estimated disruption duration: ${simDuration}h`,
      action === "WAIT" ? "No additional recovery action" : (action ? `Action evaluated: ${action}` : 'No recovery action evaluated'),
      "Existing inventory remains available"
    ]
  };
}
