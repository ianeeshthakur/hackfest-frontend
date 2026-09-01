import { clusters, factories } from "./clusterData";

// ==========================================
// MOCK LLM TOOLS
// Pure data-fetching functions used by the voice parser
// ==========================================

export function getClusters() {
  return clusters;
}

export function getClusterDetails(clusterId) {
  return clusters.find(c => c.id === clusterId) || null;
}

export function getFactoriesByCluster(clusterId) {
  return factories.filter(f => f.clusterId === clusterId);
}

export function getFactoryDetails(factoryId) {
  return factories.find(f => f.id === factoryId) || null;
}

export function getFactoriesByType(type) {
  return factories.filter(f => f.type.toLowerCase() === type.toLowerCase());
}

export function findAlternativeFactories(targetFactoryId) {
  const target = getFactoryDetails(targetFactoryId);
  if (!target) return [];

  // Filter operational factories of the same type, excluding the target
  const alts = factories.filter(f => 
    f.id !== targetFactoryId && 
    f.type === target.type && 
    f.status === "OPERATIONAL"
  );

  // Sort by capacity (highest first)
  alts.sort((a, b) => b.capacity - a.capacity);
  return alts;
}

export function calculateClusterStatistics(clusterId) {
  const cFactories = getFactoriesByCluster(clusterId);
  const operationalCount = cFactories.filter(f => f.status === "OPERATIONAL").length;
  const downCount = cFactories.filter(f => f.status === "DOWN").length;
  const warningCount = cFactories.filter(f => f.status === "WARNING").length;

  return {
    total: cFactories.length,
    operational: operationalCount,
    down: downCount,
    warning: warningCount,
  };
}
