// lib/aiAgentLogic.js

export function getPageContext(pathname, role) {
  if (pathname.includes("/factory-owner")) {
    return { title: "Factory Operations Copilot", subtitle: "Supply Chain Intelligence" };
  }
  if (pathname.includes("/command-center")) {
    return { title: "Disruption Intelligence", subtitle: "Supply Chain Intelligence" };
  }
  if (pathname.includes("/impact")) {
    return { title: "Impact Analysis", subtitle: "Supply Chain Intelligence" };
  }
  if (pathname.includes("/recovery") || pathname.includes("/buyer-recovery")) {
    return { title: "Recovery Strategy", subtitle: "Supply Chain Intelligence" };
  }
  if (pathname.includes("/decisions-audit")) {
    return { title: "Decision Support", subtitle: "Supply Chain Intelligence" };
  }
  if (pathname.includes("/cluster-map")) {
    return { title: "Network Intelligence", subtitle: "Supply Chain Intelligence" };
  }
  if (pathname.includes("/buyer")) {
    return { title: "Order Intelligence", subtitle: "Supply Chain Intelligence" };
  }
  return { title: "ThreadLine AI", subtitle: "Supply Chain Intelligence" };
}

export function getSuggestedQuestions(pathname, role) {
  if (pathname.includes("/factory-owner")) {
    return ["What is the current health of my factory?", "Which order is most at risk?", "Where is the biggest bottleneck?"];
  }
  if (pathname.includes("/command-center")) {
    return ["What happened?", "How did the disruption propagate?", "Explain the risk score"];
  }
  if (pathname.includes("/impact")) {
    return ["How many units are affected?", "What's at risk?", "Which order should be prioritized?"];
  }
  if (pathname.includes("/recovery") || pathname.includes("/buyer-recovery")) {
    return ["Which recovery is best?", "Compare the options", "What is the lowest-risk option?"];
  }
  if (pathname.includes("/decisions-audit")) {
    return ["Why should I approve this?", "What are the risks?", "What happens if I reject?"];
  }
  if (pathname.includes("/cluster-map")) {
    return ["Which supplier is safest?", "Show matching capacity", "Which region has the lowest risk?"];
  }
  if (pathname.includes("/buyer")) {
    return ["Tell me about live tracking", "Which order needs attention?", "What recovery options do I have?"];
  }
  return ["How can you help me today?"];
}

export function generateAIResponse(query, pathname, role, disruptionContext) {
  const q = query.toLowerCase();
  const { currentConfig, simulationState } = disruptionContext;
  
  // Default Idle Context
  const isIdle = !currentConfig || simulationState === "IDLE";
  
  // ==========================================
  // DISRUPTION CAUSE & TRANSLATION
  // ==========================================
  let rootCause = "internal operations";
  let buyerCause = "Production Delay Risk";
  let delay = "0";
  let riskScore = 12;
  let affectedOrders = 0;
  let confidence = 0;
  
  if (!isIdle) {
    if (currentConfig.type === "powerCut") rootCause = "Grid power failure in Sector 4";
    if (currentConfig.type === "machineBreakdown") rootCause = "Machine breakdown in the Garmenting unit";
    if (currentConfig.type === "workerShortage") rootCause = "Severe worker shortage (25% absenteeism)";
    if (currentConfig.type === "rawMaterialDelay") rootCause = "Raw material delay from Supplier T-4";
    if (currentConfig.type === "logisticsDelay") {
      rootCause = "Transit delay on critical shipment route";
      buyerCause = "Delivery Delay Risk";
    }
    
    delay = simulationState === "RESOLVED" ? currentConfig.recovery.delayHours : currentConfig.delayHours;
    riskScore = simulationState === "RESOLVED" ? currentConfig.recovery.riskScore : currentConfig.riskScore;
    affectedOrders = currentConfig.ordersAffected;
    confidence = currentConfig.confidence;
  }

  // Helper to ensure buyer never sees internal causes
  const getCauseText = () => role === "owner" ? rootCause : buyerCause;

  // ==========================================
  // SCENARIO SIMULATION ENGINE
  // ==========================================
  const { parseScenarioIntent, simulateScenario } = require('./scenarioEngine');
  const scenarioParams = parseScenarioIntent(q);

  if (scenarioParams && !isIdle) {
    const simResult = simulateScenario(currentConfig, scenarioParams);
    
    // Construct role-gated explanation
    let explanationText = "";
    if (role === "buyer") {
      if (scenarioParams.action === "WAIT") {
        explanationText = `Doing nothing allows the disruption to continue consuming the available production buffer. The main consequence is increasing delivery risk for your order.`;
      } else if (scenarioParams.action === "REROUTE") {
        explanationText = `Rerouting production to a qualified alternate facility reduces the expected delay to +${simResult.projected.delay}h and significantly lowers the fulfillment risk.`;
      } else {
        explanationText = `Assuming the disruption continues${scenarioParams.duration ? ` for another ${scenarioParams.duration} hours` : ''}, your order is projected to experience approximately +${simResult.projected.delay}h additional delay and higher fulfillment risk.`;
      }
    } else {
      // Owner gets internal details
      if (scenarioParams.action === "WAIT") {
        explanationText = `Doing nothing allows the ${rootCause} to continue consuming the available production buffer. The main consequence is increasing deadline and fulfillment risk.`;
      } else if (scenarioParams.action === "REROUTE") {
        explanationText = `Rerouting costs more (+₹${simResult.projected.cost?.toLocaleString()}) but substantially reduces expected delay and fulfillment risk for the affected orders.`;
      } else if (scenarioParams.isComparison) {
        explanationText = `Rerouting costs more but substantially reduces expected delay and fulfillment risk compared to waiting.`;
      } else {
        explanationText = `With ${scenarioParams.duration ? `a ${scenarioParams.duration}-hour` : 'an extended'} ${rootCause}, the current production buffer is unlikely to fully absorb the lost production time. The order therefore moves into higher deadline risk.`;
      }
    }

    // Determine type
    const msgType = scenarioParams.isComparison ? "comparison" : "scenario";
    
    return {
      type: msgType,
      text: explanationText,
      data: simResult,
      followUps: ["What if we do nothing?", "What if we reroute?", "Why did the risk increase?"]
    };
  }

  // ==========================================
  // HARDCODED RESPONSES (Fallback)
  // ==========================================
  if (q.includes("track") || q.includes("live tracking") || q.includes("map") || q.includes("route")) {
    return {
      type: "text",
      text: "The **Geographic Routing** map on your screen provides a live simulation of your order's transit. The animated tracking marker indicates the current physical position of your shipment as it moves from the manufacturing cluster in Tiruppur, through the Nhava Sheva port, and finally to your destination in Europe. The route shown is dynamically optimized to avoid currently known disruption zones."
    };
  }

  // ==========================================
  // EXPLAIN CALCULATION / WHY RISK INCREASED
  // ==========================================
  if (q.includes("calculate") || (q.includes("why") && q.includes("risk"))) {
     if (isIdle) return { type: "text", text: "There are no active risks to calculate.", followUps: [] };
     return {
       type: "text",
       text: `**CALCULATION**\n\n${currentConfig.delayHours}h disruption\n↓\nEstimated production loss: ${currentConfig.affectedUnits.toLocaleString()} units\n↓\nRemaining production buffer reduced\n↓\nDeadline buffer falls below threshold\n↓\nOrder risk increases\n\n**RISK CHANGE:**\n${Math.max(12, currentConfig.riskScore - 15)} → ${currentConfig.riskScore}`,
       followUps: ["What if we wait?", "What if we reroute?"]
     };
  }

  // ==========================================
  // PAGE: FACTORY OWNER (Operations Copilot)
  // ==========================================
  if (pathname.includes("/factory-owner")) {
    if (q.includes("health") || q.includes("status")) {
      if (isIdle) return { type: "text", text: "Your factory is operating at full capacity. Machine uptime is stable, power is uninterrupted, and all current orders are on track." };
      
      return { type: "text", text: `A disruption has been detected. Operational capacity has fallen due to a ${getCauseText()}. ${affectedOrders} orders are now exposed to delivery risk.` };
    }
    if (q.includes("risk") || q.includes("order")) {
      if (isIdle) return { type: "text", text: "There are no orders currently at risk. Output matches scheduled demand." };
      return { type: "text", text: `The highest risk is associated with ${affectedOrders} active orders. They are approaching their delivery tolerance due to the current ${getCauseText()}.` };
    }
    if (q.includes("bottleneck")) {
      if (isIdle) return { type: "text", text: "There are no current bottlenecks. Production flow is optimal." };
      if (currentConfig?.type === "machineBreakdown") return { type: "text", text: `The primary bottleneck is a broken down line in the Garmenting unit, stopping throughput.` };
      if (currentConfig?.type === "workerShortage") return { type: "text", text: `The bottleneck is manual processing lines which are operating 25% slower due to worker absence.` };
      return { type: "text", text: `The bottleneck is tied to ${getCauseText()}, severely reducing overall production capacity.` };
    }
  }

  // ==========================================
  // PAGE: COMMAND CENTER
  // ==========================================
  if (pathname.includes("/command-center")) {
    if (q.includes("what happened") || q.includes("propagate")) {
      if (isIdle) return { type: "text", text: "All network nodes are healthy. There are no active disruptions propagating." };
      
      if (role === "owner") {
        if (currentConfig.type === "powerCut") return { type: "text", text: `A grid power failure in Sector 4 triggered an immediate shutdown of primary weaving machines. Production capacity dropped significantly, delaying ${affectedOrders} downstream orders by ${delay} hours.` };
        if (currentConfig.type === "machineBreakdown") return { type: "text", text: `Critical machinery failed unexpectedly. This halted the production line, immediately dropping output and placing ${affectedOrders} orders at risk of a ${delay}-hour delay.` };
        if (currentConfig.type === "workerShortage") return { type: "text", text: `A sudden drop in workforce availability reduced manual operation speed. This is cascading into a ${delay}-hour delay for ${affectedOrders} active orders.` };
        if (currentConfig.type === "rawMaterialDelay") return { type: "text", text: `Supplier T-4 failed to deliver raw materials on time. Without inventory, production lines will starve, leading to a projected ${delay}-hour delay.` };
        if (currentConfig.type === "logisticsDelay") return { type: "text", text: `A logistics route delay was detected in transit. This creates a projected ${delay}-hour delay for the affected shipments.` };
      } else {
        return { type: "text", text: `We have identified a ${buyerCause} in the supply network. This is expected to cause a ${delay}-hour delay affecting ${affectedOrders} active orders. We are preparing recovery options.` };
      }
    }
    if (q.includes("risk score")) {
      if (isIdle) return { type: "text", text: "The current baseline risk score is 12/100, which reflects standard operating variance." };
      
      let breakdownText = "";
      if (currentConfig.riskFactors) {
        breakdownText = currentConfig.riskFactors.map(f => `• ${f.label}: +${f.value}`).join("\n");
      }
      
      return { type: "text", text: `The ${riskScore}/100 risk score is calculated dynamically based on current conditions:\n\n${breakdownText}\n\nThis score represents the composite threat to order fulfillment.`, followUps: ["How did you calculate that?"] };
    }
  }

  // ==========================================
  // DEFAULT CATCH-ALL
  // ==========================================
  return { 
    type: "text", 
    text: `I am your supply chain copilot. I am actively monitoring ${role === "owner" ? "factory operations and network health" : "your orders and network fulfillment status"}.` 
  };
}
