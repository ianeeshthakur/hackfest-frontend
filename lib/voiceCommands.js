import { clusters, factories } from "./clusterData";

// Context state for the voice session
let conversationContext = {
  lastClusterId: null,
  lastFactoryId: null,
};

/**
 * Parses natural language into a structured intent, mimicking an LLM.
 * @param {string} text - User's spoken text
 * @returns {object} - { intent, payload, responseText }
 */
export function parseIntent(text) {
  const lowerText = text.toLowerCase();
  
  // 1. ZOOM_TO_CLUSTER / SHOW_CLUSTER
  const matchedCluster = clusters.find(c => lowerText.includes(c.id.toLowerCase()) || lowerText.includes(c.name.toLowerCase()));
  if (matchedCluster && (lowerText.includes("show") || lowerText.includes("go to") || lowerText.includes("where is"))) {
    conversationContext.lastClusterId = matchedCluster.id;
    
    // Calculate simple stats
    const clusterFactories = factories.filter(f => f.clusterId === matchedCluster.id);
    const opCount = clusterFactories.filter(f => f.status === "OPERATIONAL").length;
    const downCount = clusterFactories.filter(f => f.status === "DOWN").length;
    
    return {
      intent: "SHOW_CLUSTER",
      payload: { clusterId: matchedCluster.id },
      responseText: `Showing the ${matchedCluster.name}. It has ${clusterFactories.length} factories, with ${opCount} operational and ${downCount} disrupted.`,
    };
  }

  // 1.5 Cluster status follow-ups (e.g., "How many are down?")
  if (lowerText.includes("how many") && (lowerText.includes("down") || lowerText.includes("disrupted") || lowerText.includes("running") || lowerText.includes("operational"))) {
    if (conversationContext.lastClusterId) {
      const cFactories = factories.filter(f => f.clusterId === conversationContext.lastClusterId);
      const isDown = lowerText.includes("down") || lowerText.includes("disrupted");
      const count = cFactories.filter(f => isDown ? (f.status === "DOWN") : (f.status === "OPERATIONAL")).length;
      return {
        intent: "SHOW_CLUSTER_STATUS",
        payload: { clusterId: conversationContext.lastClusterId },
        responseText: `${count} factory${count === 1 ? ' is' : 's are'} currently ${isDown ? 'disrupted' : 'operational'} in this cluster.`
      };
    }
  }

  // 2. EXPLAIN_DISRUPTION
  if (lowerText.includes("why") && (lowerText.includes("red") || lowerText.includes("disrupted") || lowerText.includes("down"))) {
    // If we know the last selected factory, explain it. Otherwise, explain the first down factory as a demo fallback.
    const disruptedF = conversationContext.lastFactoryId 
      ? factories.find(f => f.id === conversationContext.lastFactoryId)
      : factories.find(f => f.status === "DOWN");
      
    if (disruptedF && disruptedF.status === "DOWN") {
      conversationContext.lastFactoryId = disruptedF.id;
      return {
        intent: "EXPLAIN_DISRUPTION",
        payload: { factoryId: disruptedF.id },
        responseText: `That factory is currently disrupted due to ${disruptedF.disruption || 'an unknown issue'}. The reported recovery window is approximately two days.`,
      };
    }
  }

  // 3. SHOW_ALTERNATIVES
  if (lowerText.includes("alternative") || lowerText.includes("backup")) {
    const targetFactory = conversationContext.lastFactoryId 
      ? factories.find(f => f.id === conversationContext.lastFactoryId)
      : factories.find(f => f.status === "DOWN");
      
    if (targetFactory) {
      return {
        intent: "SHOW_ALTERNATIVES",
        payload: { factoryId: targetFactory.id },
        responseText: "I found three suitable alternatives. F-X7K92 is the strongest match.",
      };
    }
  }

  // 4. FACTORY STATS / CAPACITY (e.g. "Which one has the most available capacity?")
  if (lowerText.includes("capacity") && lowerText.includes("most")) {
    // Hardcoded for the demo narrative
    return {
      intent: "HIGHLIGHT_FACTORY",
      payload: { factoryId: "F-X7K92" },
      responseText: "F-X7K92 currently has the highest available capacity at 3,200 units per day."
    };
  }

  // 5. SHOW_FACTORY (e.g. "Show it" after mentioning F-X7K92)
  if (lowerText.includes("show it") && lowerText.includes("capacity") === false) {
    // Demo fallback for F-X7K92
    return {
      intent: "HIGHLIGHT_FACTORY",
      payload: { factoryId: "F-X7K92" },
      responseText: "Showing factory F-X7K92."
    };
  }

  // 6. RESET_MAP
  if (lowerText.includes("reset") || lowerText.includes("india")) {
    conversationContext = { lastClusterId: null, lastFactoryId: null };
    return {
      intent: "RESET_MAP",
      payload: {},
      responseText: "Resetting the map to the India overview.",
    };
  }
  
  // 7. ORDER_QUERIES
  if (lowerText.includes("my order")) {
    if (lowerText.includes("affected")) {
      return {
        intent: "SHOW_ORDER_IMPACT",
        payload: { orderId: "demo-1" },
        responseText: "Your order is affected because F-020 is currently disrupted. Recovery options are being evaluated."
      };
    }
    return {
      intent: "SHOW_ORDER_STATUS",
      payload: { orderId: "demo-1" },
      responseText: "Your order is currently assigned to F-020 in the Surat cluster."
    };
  }

  // Default / Unknown
  return {
    intent: "UNKNOWN",
    payload: {},
    responseText: "I'm sorry, I didn't understand that request. Could you rephrase?",
  };
}

export function updateContext(key, value) {
  conversationContext[key] = value;
}
