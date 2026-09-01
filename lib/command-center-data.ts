// ─────────────────────────────────────────────────────────────────────────────
// TextileMesh AI — Owner Command Center Mock Data
// ─────────────────────────────────────────────────────────────────────────────
// All values here mirror what the real backend will eventually return.
// Future integration: replace these with API calls (e.g. POST /factoryagent/{id})
// without rewriting the UI — just swap mock data for API responses.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export type UnitStatus = "running" | "warning" | "disrupted" | "offline";
export type OrderStatus = "secured" | "rerouting" | "at_risk" | "completed";
export type DisruptionSeverity = "low" | "medium" | "high" | "critical";

export interface ProductionUnit {
  id: string;
  name: string;
  process: string;
  status: UnitStatus;
  speed: number | null;
  speedUnit: string | null;
  lastHeartbeat: string;
  lastHeartbeatTimestamp: string;
  missedHeartbeats: number;
  metricLabel: string;
  metricValue: string;
  iconName: "Cog" | "Layers" | "Droplets" | "Scissors";
  facilityId: string;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  ownerId: string;
}

export interface Owner {
  id: string;
  name: string;
  company: string;
  avatarInitials: string;
  facilityId: string;
}

export interface Disruption {
  id: string;
  unitId: string;
  unitName: string;
  title: string;
  description: string;
  severity: DisruptionSeverity;
  detectedAt: string;
  detectedRelative: string;
  missedHeartbeats: number;
  aiResponse: string;
  aiStatusStep: "detecting" | "evaluating" | "rerouting" | "resolved";
}

export interface AIAction {
  id: string;
  timestamp: string;
  timestampRelative: string;
  title: string;
  steps: string[];
  relatedUnitId?: string;
  relatedOrderId?: string;
  outcome: "in_progress" | "completed" | "pending_review";
}

export interface Order {
  id: string;
  orderRef: string;
  status: OrderStatus;
  reason?: string;
  aiAction?: string;
  buyer: string;
  product: string;
  quantity: string;
  deliveryDate: string;
}

export interface NetworkHealth {
  overallHealthPercent: number;
  totalUnits: number;
  onlineUnits: number;
  warningUnits: number;
  disruptedUnits: number;
  heartbeatData: number[];
}

// ── Owner & Facility ─────────────────────────────────────────────────────────

export const OWNER: Owner = {
  id: "owner-001",
  name: "Rajesh Mehta",
  company: "Mehta Textiles Pvt. Ltd.",
  avatarInitials: "RM",
  facilityId: "facility-001",
};

export const FACILITY: Facility = {
  id: "facility-001",
  name: "Mehta Textile Park",
  location: "Surat, Gujarat",
  ownerId: "owner-001",
};

// ── Production Units ─────────────────────────────────────────────────────────

export const PRODUCTION_UNITS: ProductionUnit[] = [
  {
    id: "unit-spinning",
    name: "Spinning Unit",
    process: "Spinning",
    status: "running",
    speed: 82,
    speedUnit: "RPM",
    lastHeartbeat: "8 sec ago",
    lastHeartbeatTimestamp: "2026-08-31T13:10:14Z",
    missedHeartbeats: 0,
    metricLabel: "Yarn Output",
    metricValue: "340 kg/hr",
    iconName: "Cog",
    facilityId: "facility-001",
  },
  {
    id: "unit-weaving",
    name: "Weaving Unit",
    process: "Weaving",
    status: "running",
    speed: 76,
    speedUnit: "RPM",
    lastHeartbeat: "11 sec ago",
    lastHeartbeatTimestamp: "2026-08-31T13:10:11Z",
    missedHeartbeats: 0,
    metricLabel: "Loom Efficiency",
    metricValue: "94%",
    iconName: "Layers",
    facilityId: "facility-001",
  },
  {
    id: "unit-dyeing",
    name: "Dyeing Unit",
    process: "Dyeing",
    status: "warning",
    speed: null,
    speedUnit: null,
    lastHeartbeat: "18 sec ago",
    lastHeartbeatTimestamp: "2026-08-31T13:10:04Z",
    missedHeartbeats: 1,
    metricLabel: "Batch Status",
    metricValue: "1 batch delayed",
    iconName: "Droplets",
    facilityId: "facility-001",
  },
  {
    id: "unit-garmenting",
    name: "Garmenting Unit",
    process: "Garmenting",
    status: "disrupted",
    speed: null,
    speedUnit: null,
    lastHeartbeat: "3 min ago",
    lastHeartbeatTimestamp: "2026-08-31T13:07:22Z",
    missedHeartbeats: 3,
    metricLabel: "Active Orders",
    metricValue: "4 at risk",
    iconName: "Scissors",
    facilityId: "facility-001",
  },
];

// ── Network Health ────────────────────────────────────────────────────────────

export const NETWORK_HEALTH: NetworkHealth = {
  overallHealthPercent: 91,
  totalUnits: 8,
  onlineUnits: 6,
  warningUnits: 1,
  disruptedUnits: 1,
  heartbeatData: [72, 85, 91, 78, 95, 88, 60, 92, 75, 98, 85, 70, 95, 88, 82, 94, 79, 96, 84, 89],
};

export const UNIT_SUMMARY = {
  total: 8,
  running: 6,
  warning: 1,
  disrupted: 1,
};

// ── Disruptions ───────────────────────────────────────────────────────────────

export const DISRUPTIONS: Disruption[] = [
  {
    id: "dis-001",
    unitId: "unit-garmenting",
    unitName: "Garmenting Unit",
    title: "Power disruption detected",
    description:
      "The Garmenting Unit stopped sending operational signals. A power supply interruption has been identified as the root cause. The unit has been unresponsive for the last 4 minutes.",
    severity: "critical",
    detectedAt: "2026-08-31T13:07:22Z",
    detectedRelative: "4 minutes ago",
    missedHeartbeats: 3,
    aiResponse:
      "Orders linked to the Garmenting Unit are being evaluated for rerouting to available cluster capacity. Alternative production matching is in progress.",
    aiStatusStep: "rerouting",
  },
];

// ── AI Actions ────────────────────────────────────────────────────────────────

export const AI_ACTIONS: AIAction[] = [
  {
    id: "ai-001",
    timestamp: "2026-08-31T13:08:00Z",
    timestampRelative: "4 min ago",
    title: "Power disruption detected in Garmenting Unit",
    steps: [
      "Unit heartbeat stopped — 3 missed signals in a row",
      "Power interruption identified as root cause",
      "4 active orders flagged as potentially at risk",
      "Alternative production capacity identified in cluster",
      "Orders being evaluated for rerouting",
    ],
    relatedUnitId: "unit-garmenting",
    outcome: "in_progress",
  },
  {
    id: "ai-002",
    timestamp: "2026-08-31T12:55:00Z",
    timestampRelative: "19 min ago",
    title: "Dyeing Unit slowdown detected",
    steps: [
      "Dyeing Unit reported elevated response latency",
      "Batch processing delay of 1 batch identified",
      "Available capacity in other dyeing clusters assessed",
      "Workload redistribution recommended — awaiting operator review",
    ],
    relatedUnitId: "unit-dyeing",
    outcome: "pending_review",
  },
  {
    id: "ai-003",
    timestamp: "2026-08-31T11:30:00Z",
    timestampRelative: "1 hr 50 min ago",
    title: "Order TX-1037 secured via alternate capacity",
    steps: [
      "Cluster-level capacity scan triggered",
      "Alternate production unit matched via privacy-preserving bidding",
      "Order TX-1037 rerouted and confirmed",
      "Delivery timeline maintained within SLA",
    ],
    relatedOrderId: "order-tx-1037",
    outcome: "completed",
  },
];

// ── Orders ────────────────────────────────────────────────────────────────────

export const ORDERS: Order[] = [
  {
    id: "order-tx-1042",
    orderRef: "TX-1042",
    status: "rerouting",
    reason: "Garmenting Unit disruption",
    buyer: "Reliance Retail Ltd.",
    product: "Cotton Kurta Sets",
    quantity: "2,400 pcs",
    deliveryDate: "Sep 4, 2026",
  },
  {
    id: "order-tx-1041",
    orderRef: "TX-1041",
    status: "at_risk",
    reason: "Garmenting Unit disruption",
    buyer: "Myntra Fashion Forward",
    product: "Linen Trousers",
    quantity: "1,800 pcs",
    deliveryDate: "Sep 3, 2026",
  },
  {
    id: "order-tx-1039",
    orderRef: "TX-1039",
    status: "at_risk",
    reason: "Dyeing Unit delay",
    buyer: "Fabindia Stores",
    product: "Block Print Dupatta",
    quantity: "960 pcs",
    deliveryDate: "Sep 2, 2026",
  },
  {
    id: "order-tx-1037",
    orderRef: "TX-1037",
    status: "secured",
    aiAction: "AI matched alternate production capacity via cluster network",
    buyer: "H&M India",
    product: "Woven Fabric Roll",
    quantity: "5,200 m",
    deliveryDate: "Sep 5, 2026",
  },
  {
    id: "order-tx-1035",
    orderRef: "TX-1035",
    status: "secured",
    aiAction: "Normal production — no disruption",
    buyer: "Global Desi",
    product: "Printed Silk Tops",
    quantity: "3,200 pcs",
    deliveryDate: "Sep 7, 2026",
  },
];

export const ORDER_SUMMARY = {
  total: 24,
  atRisk: 3,
  rerouted: 5,
  secured: 21,
};

// ── Navigation Items ──────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  isActive?: boolean;
  badge?: number;
  variant?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "nav-cc",
    label: "Command Center",
    href: "/command-center",
    iconName: "LayoutDashboard",
  },
  {
    id: "nav-map",
    label: "Cluster Map",
    href: "/cluster-map",
    iconName: "Map",
  },
  {
    id: "nav-factory",
    label: "Factory Dashboard",
    href: "/factory-owner",
    iconName: "Factory",
  },
  {
    id: "nav-logistics",
    label: "Global Logistics",
    href: "/global-logistics",
    iconName: "Network",
    variant: "ghost",
  },
  {
    id: "nav-investigation",
    label: "Investigation",
    href: "/investigation",
    iconName: "Search",
    variant: "ghost",
  },
];
