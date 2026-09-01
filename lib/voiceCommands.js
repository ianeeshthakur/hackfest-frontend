import * as tools from "./networkTools";

// ==========================================
// VOICE CONTEXT MANAGER
// ==========================================
let context = {
  lastClusterId: null,
  lastFactoryId: null,
  lastProcess: null,
};

export function updateContext(key, value) {
  context[key] = value;
}

export function getContext() {
  return context;
}

// ==========================================
// SEMANTIC ROUTER & ENTITY EXTRACTOR
// ==========================================

function extractEntities(text) {
  const t = text.toLowerCase();
  let entities = { clusterId: null, factoryId: null, process: null, status: null, isImplicit: false };

  // 1. Check for explicit Clusters
  const clusters = tools.getClusters();
  for (const c of clusters) {
    if (t.includes(c.id.toLowerCase()) || t.includes(c.name.toLowerCase().split(' ')[0])) {
      entities.clusterId = c.id;
      break;
    }
  }

  // 2. Check for explicit Processes
  const processes = ["spinning", "weaving", "knitting", "dyeing", "printing", "finishing", "garmenting"];
  for (const p of processes) {
    if (t.includes(p)) {
      entities.process = p;
      break;
    }
  }

  // 3. Check for implicit references (pronouns/Hinglish pointers)
  const implicitPointers = [
    "it", "this", "that", "there", "those", "one", 
    "is", "isme", "usme", "waha", "yaha", "ye", "wali"
  ];
  if (implicitPointers.some(p => t.includes(` ${p} `) || t.startsWith(`${p} `) || t.endsWith(` ${p}`))) {
    entities.isImplicit = true;
  }

  return entities;
}

/**
 * Advanced Intent Parser replicating LLM semantic reasoning
 */
export function parseIntent(rawText) {
  const text = rawText.toLowerCase();
  const entities = extractEntities(text);

  // --- 1. RESOLVE CONTEXT ---
  let activeClusterId = entities.clusterId;
  let activeFactoryId = entities.factoryId;
  
  if (entities.isImplicit || (!activeClusterId && !activeFactoryId)) {
    // Fallback to recent context if the user implies it
    activeClusterId = activeClusterId || context.lastClusterId;
    activeFactoryId = activeFactoryId || context.lastFactoryId;
  }

  // Update context if explicit entities were found
  if (entities.clusterId) context.lastClusterId = entities.clusterId;
  if (entities.factoryId) context.lastFactoryId = entities.factoryId;
  if (entities.process) context.lastProcess = entities.process;

  // --- 2. MATCH INTENTS (English + Hindi/Hinglish Support) ---

  // RESET
  if (text.includes("reset") || text.includes("india") || text.includes("start over")) {
    context.lastClusterId = null;
    context.lastFactoryId = null;
    return {
      intent: "RESET_MAP",
      payload: {},
      responseText: "Resetting the network view to India."
    };
  }

  // COUNT CLUSTERS: "How many clusters?", "Total clusters kitne hain?"
  if (
    (text.includes("how many") && text.includes("cluster")) ||
    (text.includes("kitne") && text.includes("cluster")) ||
    (text.includes("total") && text.includes("cluster"))
  ) {
    const clusters = tools.getClusters();
    const names = clusters.map(c => c.name.replace(" Cluster", "")).join(", ");
    return {
      intent: "NONE", // Just speak, no map action needed
      payload: {},
      responseText: `We currently have ${clusters.length} clusters: ${names}.`
    };
  }

  // BIGGEST CLUSTER: "Which is the biggest?", "Most factories?"
  if (
    (text.includes("biggest") || text.includes("largest") || text.includes("most factories")) &&
    (!text.includes("which factory") && !text.includes("kaunsi factory"))
  ) {
    const clusters = tools.getClusters();
    let biggest = clusters[0];
    let max = 0;
    for (const c of clusters) {
      const count = tools.getFactoriesByCluster(c.id).length;
      if (count > max) { max = count; biggest = c; }
    }
    context.lastClusterId = biggest.id;
    return {
      intent: "SHOW_CLUSTER",
      payload: { clusterId: biggest.id },
      responseText: `${biggest.name.replace(" Cluster", "")} is the largest with ${max} factories.`
    };
  }

  // COUNT FACTORIES IN CLUSTER: "How many factories in Surat?", "Waha kitni factories hain?"
  if (
    (text.includes("how many") && (text.includes("factor") || text.includes("there"))) ||
    (text.includes("kitni") && (text.includes("factor") || text.includes("hai") || text.includes("hain")))
  ) {
    // Are they asking about DOWN or OPERATIONAL?
    const isDown = text.includes("down") || text.includes("disrupted") || text.includes("kharab") || text.includes("red");
    const isOp = text.includes("operational") || text.includes("running") || text.includes("chalu");

    if (activeClusterId) {
      const stats = tools.calculateClusterStatistics(activeClusterId);
      const cName = tools.getClusterDetails(activeClusterId).name.replace(" Cluster", "");
      
      if (isDown) {
        return {
          intent: "SHOW_CLUSTER_STATUS",
          payload: { clusterId: activeClusterId },
          responseText: `${stats.down} factory is currently disrupted in ${cName}.`
        };
      }
      if (isOp) {
        return {
          intent: "SHOW_CLUSTER_STATUS",
          payload: { clusterId: activeClusterId },
          responseText: `${cName} has ${stats.operational} operational factories.`
        };
      }
      // General count
      return {
        intent: "SHOW_CLUSTER_STATUS",
        payload: { clusterId: activeClusterId },
        responseText: `${cName} has ${stats.total} factories.`
      };
    }
  }

  // SHOW CLUSTER: "Show Surat", "Surat dikhao"
  if (
    (text.includes("show") || text.includes("dikhao") || text.includes("go to") || text.includes("where is")) &&
    entities.clusterId
  ) {
    const cName = tools.getClusterDetails(entities.clusterId).name;
    return {
      intent: "SHOW_CLUSTER",
      payload: { clusterId: entities.clusterId },
      responseText: `Showing the ${cName}.`
    };
  }

  // SHOW FACTORY / "Show it" / "Highlight that one"
  if (
    (text.includes("show") || text.includes("highlight") || text.includes("dikhao")) &&
    entities.isImplicit && activeClusterId
  ) {
    // If they say "show it" after asking "how many are down", find the down factory in that cluster
    const cFactories = tools.getFactoriesByCluster(activeClusterId);
    const downF = cFactories.find(f => f.status === "DOWN");
    if (downF) {
      context.lastFactoryId = downF.id;
      return {
        intent: "HIGHLIGHT_FACTORY",
        payload: { factoryId: downF.id },
        responseText: `Highlighting the disrupted factory.`
      };
    }
  }

  // EXPLAIN DISRUPTION: "Why is it down?", "Ye kyu down hai?"
  if (text.includes("why") || text.includes("kyu") || text.includes("reason")) {
    const fId = activeFactoryId || (activeClusterId ? tools.getFactoriesByCluster(activeClusterId).find(f=>f.status==="DOWN")?.id : null);
    if (fId) {
      context.lastFactoryId = fId;
      const f = tools.getFactoryDetails(fId);
      return {
        intent: "EXPLAIN_DISRUPTION",
        payload: { factoryId: fId },
        responseText: `The factory is down due to ${f.disruption || 'an operational issue'}.`
      };
    }
  }

  // FIND ALTERNATIVES: "Can I use another factory?", "Alternative dikhao", "Backup"
  if (text.includes("alternative") || text.includes("backup") || text.includes("another factory") || text.includes("dusri factory") || text.includes("dusra option")) {
    const fId = activeFactoryId || (activeClusterId ? tools.getFactoriesByCluster(activeClusterId).find(f=>f.status==="DOWN")?.id : null);
    if (fId) {
      const f = tools.getFactoryDetails(fId);
      const alts = tools.findAlternativeFactories(fId);
      if (alts.length > 0) {
        return {
          intent: "SHOW_ALTERNATIVES",
          payload: { factoryId: fId },
          responseText: `Yes. I found ${alts.length} operational alternatives with the same ${f.type.toLowerCase()} capability.`
        };
      }
    }
  }

  // BEST ALTERNATIVE / MULTI-STEP REASONING: "Which one is best?", "Kaunsa best hai?"
  if (text.includes("best") || text.includes("strongest") || text.includes("sabse accha")) {
    const fId = activeFactoryId || (activeClusterId ? tools.getFactoriesByCluster(activeClusterId).find(f=>f.status==="DOWN")?.id : null);
    if (fId) {
      const alts = tools.findAlternativeFactories(fId);
      if (alts.length > 0) {
        const best = alts[0]; // Already sorted by capacity in networkTools
        context.lastFactoryId = best.id;
        return {
          intent: "NONE", // No map action immediately, wait for user to say "show it"
          payload: {},
          responseText: `${best.id} is the strongest match, with ${best.capacity.toLocaleString()} units per day of available capacity.`
        };
      }
    }
  }

  // DEFAULT / UNKNOWN
  return {
    intent: "UNKNOWN",
    payload: {},
    responseText: "I'm sorry, I couldn't understand that or I don't have enough verified data to answer."
  };
}
