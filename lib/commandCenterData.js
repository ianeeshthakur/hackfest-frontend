export const INITIAL_METRICS = {
  total: 8,
  running: 6,
  warning: 1,
  disrupted: 1,
  networkHealth: 91,
};

export const RESOLVED_METRICS = {
  total: 8,
  running: 7,
  warning: 1,
  disrupted: 0,
  networkHealth: 94,
};

export const DISRUPTED_METRICS = {
  total: 8,
  running: 6,
  warning: 1,
  disrupted: 1,
  networkHealth: 88,
};

export const ACTIVE_DISRUPTION_DATA = {
  unitName: "GARMENTING UNIT",
  severity: "CRITICAL",
  title: "Power disruption detected",
  description: "The Garmenting Unit stopped sending operational signals. A power supply interruption has been identified as the root cause. The unit has been unresponsive for the last 4 minutes.",
  missedHeartbeats: 3,
};
