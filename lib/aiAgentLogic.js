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
    return ["Which order needs attention?", "What is my updated ETA?", "What recovery options do I have?"];
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
  // PAGE: FACTORY OWNER (Operations Copilot)
  // ==========================================
  if (pathname.includes("/factory-owner")) {
    if (q.includes("health") || q.includes("status")) {
      if (isIdle) return "Your factory is currently operating at 100% capacity. Machine uptime is stable, and power supply is uninterrupted. All orders are on track.";
      
      return `A disruption has been detected. Operational capacity has fallen due to ${getCauseText()}. ${affectedOrders} orders are now exposed to delivery risk.`;
    }
    if (q.includes("risk") || q.includes("order")) {
      if (isIdle) return "There are no orders currently at risk. Output matches scheduled demand.";
      return `The highest risk is associated with ${affectedOrders} active orders approaching their delivery tolerance due to the current ${getCauseText()}.`;
    }
    if (q.includes("bottleneck")) {
      if (isIdle) return "There are no current bottlenecks. Production flow is optimal.";
      if (currentConfig?.id === "machine") return `The primary bottleneck is a broken down line in the Garmenting unit, stopping throughput.`;
      if (currentConfig?.id === "worker") return `The bottleneck is manual processing lines which are operating 25% slower due to worker absence.`;
      return `The bottleneck is tied to ${getCauseText()}, severely reducing overall production capacity.`;
    }
  }

  // ==========================================
  // PAGE: COMMAND CENTER
  // ==========================================
  if (pathname.includes("/command-center")) {
    if (q.includes("what happened") || q.includes("propagate")) {
      if (isIdle) return "All network nodes are healthy. There are no active disruptions propagating.";
      
      if (role === "owner") {
        if (currentConfig.id === "power") return `A grid power failure in Sector 4 triggered an immediate shutdown of primary weaving machines. Production capacity dropped to ${Math.round((currentConfig.availableUnits/currentConfig.totalUnits)*100)}%, delaying ${affectedOrders} downstream orders by ${delay} hours.`;
        if (currentConfig.id === "machine") return `Critical machinery failed unexpectedly. This halted the production line, immediately dropping output and placing ${affectedOrders} orders at risk of a ${delay}-hour delay.`;
        if (currentConfig.id === "worker") return `A sudden 25% drop in workforce availability reduced manual operation speed, cascading into a ${delay}-hour delay for ${affectedOrders} active orders.`;
        if (currentConfig.id === "material") return `Supplier T-4 failed to deliver raw materials on time. Without inventory, production lines will starve, leading to a projected ${delay}-hour delay.`;
      } else {
        return `We have identified a ${buyerCause} in the supply network. This is expected to cause a ${delay}-hour delay affecting ${affectedOrders} active orders. We are preparing recovery options.`;
      }
    }
    if (q.includes("risk score")) {
      if (isIdle) return "The current baseline risk score is 12/100, which reflects standard operating variance.";
      
      // Calculate based on the formula defined in ExplainableRiskScore.jsx
      const dScore = Math.round(riskScore * 0.30);
      const dlScore = Math.round(riskScore * 0.25);
      const cScore = Math.round(riskScore * 0.15);
      const sScore = Math.round(riskScore * 0.15);
      const rScore = Math.round(riskScore * 0.15);
      
      const diff = riskScore - (dScore + dlScore + cScore + sScore + rScore);
      const finalDScore = dScore + diff;
      
      return `The ${riskScore}/100 risk score is calculated dynamically based on current conditions:\n\n• Production Impact: +${finalDScore}\n• Delivery Proximity: +${dlScore}\n• Capacity Reduction: +${cScore}\n• Inventory Exposure: +${sScore}\n• Network Dependency: +${rScore}\n\nThis score represents the composite threat to order fulfillment.`;
    }
  }

  // ==========================================
  // PAGE: IMPACT & INVENTORY
  // ==========================================
  if (pathname.includes("/impact")) {
    if (q.includes("unit") || q.includes("many") || q.includes("risk")) {
      if (isIdle) return "There are 0 units at risk currently. Inventory and capacity are perfectly aligned.";
      return `There are ${currentConfig.affectedUnits.toLocaleString()} units exposed to the disruption. This stems from a ${currentConfig.capacityImpact}% capacity reduction, putting a total inventory value of ${currentConfig.ordersAffected} critical orders at risk.`;
    }
    if (q.includes("prioritized")) {
      return `Order TX-2048 should be prioritized due to its strict delivery deadline and high SLA penalties.`;
    }
  }

  // ==========================================
  // PAGE: RECOVERY OPTIONS
  // ==========================================
  if (pathname.includes("/recovery") || pathname.includes("/buyer-recovery")) {
    if (q.includes("best") || q.includes("compare")) {
      if (isIdle) return "There are no active disruptions requiring recovery.";
      return `Rerouting is the recommended strategy. \n\n• **WAIT**: High delay, low cost, high risk (${currentConfig?.riskScore || 72}/100).\n• **SPLIT**: Medium delay, high cost, medium risk.\n• **REROUTE**: Reduces expected delay to +${currentConfig?.recovery?.delayHours || 2}h and lowers fulfillment risk to ${currentConfig?.recovery?.riskScore || 24}/100. It adds ₹18,500 in logistics cost, but maximizes delivery confidence (${confidence}%).`;
    }
    if (q.includes("lowest-risk") || q.includes("lowest risk")) {
      return `Rerouting is the lowest-risk option. It immediately reassigns production to a healthy node, bypassing the ${getCauseText()} entirely and ensuring the delivery window is met.`;
    }
  }

  // ==========================================
  // PAGE: DECISION CENTER
  // ==========================================
  if (pathname.includes("/decisions-audit")) {
    if (q.includes("approve") || q.includes("reject") || q.includes("risk")) {
      return `Approving the reroute will reallocate ${currentConfig?.recovery?.availableUnits?.toLocaleString() || 12000} units to an alternate supplier, reducing the risk score to ${currentConfig?.recovery?.riskScore || 24}/100 and securing the ETA. \n\nIf you reject, the order remains exposed to the ${getCauseText()}, risking a ${delay}-hour delay and potential SLA breach. All compliance and certification checks for the alternate supplier have passed. I cannot make this decision for you.`;
    }
  }

  // ==========================================
  // PAGE: CLUSTER MAP
  // ==========================================
  if (pathname.includes("/cluster-map")) {
    if (q.includes("supplier") || q.includes("safest") || q.includes("capacity")) {
      return `SuppA-T02 in the Surat Cluster is currently the strongest alternative. It has 12,000 units/day of available capacity, a 92% reliability score, and matches the required GOTS weaving certification for your active orders.`;
    }
    if (q.includes("region") || q.includes("risk")) {
      return `The Ludhiana cluster currently shows the lowest regional risk score, but the Surat cluster has the most immediate matching capacity for the affected product profile.`;
    }
  }

  // ==========================================
  // PAGE: MY ORDERS (BUYER)
  // ==========================================
  if (pathname.includes("/buyer")) {
    if (q.includes("attention") || q.includes("risk")) {
      if (isIdle) return "All of your orders are currently on track and operating normally.";
      return `Order TX-2048 requires your attention. It is currently flagged with a ${buyerCause}.`;
    }
    if (q.includes("eta") || q.includes("delayed")) {
      if (isIdle) return "Your ETA remains unchanged. Order TX-2048 is scheduled for on-time delivery.";
      return `Due to a ${buyerCause}, Order TX-2048 has an expected delay of +${delay} hours. The updated ETA is Sep 04 + ${delay}h.`;
    }
    if (q.includes("recovery")) {
      return `We have prepared multiple recovery scenarios, including an option to reroute production to an alternate GOTS-certified facility to minimize the delay. Please review the Recovery Options page for details.`;
    }
  }

  // ==========================================
  // DEFAULT CATCH-ALL
  // ==========================================
  return `I am your supply chain copilot. I am actively monitoring ${role === "owner" ? "factory operations and network health" : "your orders and network fulfillment status"}.`;
}
