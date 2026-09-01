// ─────────────────────────────────────────────────────────────────────────────
// Buyer-Safe Data Layer
// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: This file contains ONLY business-level data safe for buyer view.
// Internal factory diagnostics, root causes, machine telemetry, worker data,
// power/utility statuses, and operational metrics are NEVER included here.
// Buyer data is constructed independently — never derived from factory internals.
// ─────────────────────────────────────────────────────────────────────────────

export const BUYER_PROFILE = {
  name: "Anika Sharma",
  company: "Zara Sourcing (EU)",
  region: "Europe",
  buyerId: "BYR-0041",
  currency: "INR",
};

// Business-level status labels safe for buyer communication
export const BUYER_STATUS = {
  ON_TRACK:       { label: "On Track",              color: "emerald" },
  AT_RISK:        { label: "At Risk",                color: "red"     },
  DELAYED:        { label: "Delay Likely",           color: "amber"   },
  DECISION_REQD:  { label: "Decision Required",      color: "blue"    },
  SECURED:        { label: "Secured",                color: "emerald" },
};

// Top-level buyer metrics — business outcomes only
export const BUYER_SUMMARY = {
  activeOrders: 3,
  ordersAtRisk: 2,
  decisionsRequired: 1,
  expectedDelays: 2,
};

// Per-order buyer view — business language only
// notificationReason uses supply-chain terms, never factory-internal causes
export const BUYER_ORDERS = [
  {
    id: "TX-2048",
    product: "Cotton Twill",
    quantity: "12,000 m",
    unit: "meters",
    originalETA: "Sep 04",
    updatedETA: "Sep 04 + 9h",
    etaShift: "+9h",
    status: "AT_RISK",
    risk: 72,
    confidence: 91,
    decisionRequired: true,

    // Business-level notification — no internal cause
    notificationType: "PRODUCTION DELAY RISK",
    notificationMessage: "Your order may arrive later than planned due to a supply chain disruption in the region.",

    // Recovery option summary (buyer-safe)
    recoveryOptions: [
      {
        id: "opt-reroute",
        label: "Accept Alternate Sourcing",
        impact: "Delay reduced to +2h",
        costImpact: "Minor cost adjustment may apply",
        recommended: true,
      },
      {
        id: "opt-wait",
        label: "Wait for Original Supplier",
        impact: "Expected delay remains +9h",
        costImpact: "No additional cost",
        recommended: false,
      },
    ],

    // Supply-chain timeline (buyer-visible events)
    timeline: [
      { time: "Aug 31, 21:00", event: "Order in production", type: "info" },
      { time: "Sep 01, 20:58", event: "Production delay detected in supply chain", type: "alert" },
      { time: "Sep 01, 21:10", event: "Alternate sourcing option identified", type: "action" },
      { time: "Sep 01, 21:30", event: "Awaiting your decision", type: "pending" },
    ],
  },
  {
    id: "TX-3011",
    product: "Polyester Blend",
    quantity: "8,500 m",
    unit: "meters",
    originalETA: "Sep 06",
    updatedETA: "Sep 06 + 6h",
    etaShift: "+6h",
    status: "AT_RISK",
    risk: 65,
    confidence: 86,
    decisionRequired: false,

    notificationType: "PRODUCTION DELAY RISK",
    notificationMessage: "Your order is at risk of a minor delay. Our team is actively managing the situation.",

    recoveryOptions: [],

    timeline: [
      { time: "Aug 30, 09:00", event: "Order confirmed and in production", type: "info" },
      { time: "Sep 01, 21:00", event: "Supply chain delay flagged", type: "alert" },
      { time: "Sep 01, 21:15", event: "Recovery in progress", type: "action" },
    ],
  },
  {
    id: "TX-4402",
    product: "Linen Yarn",
    quantity: "5,000 m",
    unit: "meters",
    originalETA: "Sep 12",
    updatedETA: "Sep 12 + 4h",
    etaShift: "+4h",
    status: "DELAYED",
    risk: 55,
    confidence: 78,
    decisionRequired: false,

    notificationType: "MINOR DELAY EXPECTED",
    notificationMessage: "A minor delay is expected for this order. Fulfillment remains on schedule for the week.",

    recoveryOptions: [],

    timeline: [
      { time: "Aug 28, 14:00", event: "Order placed and confirmed", type: "info" },
      { time: "Sep 01, 20:00", event: "Minor delay flagged by logistics partner", type: "alert" },
      { time: "Sep 01, 20:30", event: "Team is managing resolution", type: "action" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Buyer Recovery Options — Business Language Only
// ─────────────────────────────────────────────────────────────────────────────
// NO internal factory cause, NO machine diagnostics, NO operational data.
// Buyer sees only business outcomes and supply-chain explanations.
// ─────────────────────────────────────────────────────────────────────────────

export const BUYER_RECOVERY_CONTEXT = {
  orderId: "TX-2048",
  product: "Cotton Twill",
  quantity: "12,000 m",
  originalDeadline: "Sep 04",
  caseId: "TL-4821",
};

export const BUYER_RECOVERY_OPTIONS = [
  {
    id: "wait",
    label: "OPTION A",
    name: "WAIT",
    description: "Your order remains with the original supplier. Fulfillment will resume once the supply chain disruption is resolved.",
    delay: "+9h",
    delaySortVal: 9,
    costImpact: "₹0",
    costLabel: "No additional cost",
    risk: 72,
    confidence: 91,
    recommended: false,
    color: "red",
    whyThisOption: [
      "No additional sourcing cost incurred",
      "Original supplier relationship preserved",
      "Suitable if deadline flexibility exists",
    ],
    tradeoffs: [
      "Longest expected delay (+9h)",
      "Higher risk of missing your Sep 04 deadline",
      "Fulfillment risk remains elevated",
    ],
  },
  {
    id: "split",
    label: "OPTION B",
    name: "SPLIT",
    description: "Your order is partially fulfilled by the original supplier, with the remainder sourced from a certified alternate partner.",
    delay: "+4h",
    delaySortVal: 4,
    costImpact: "+₹6,500",
    costLabel: "Minor additional sourcing cost",
    risk: 39,
    confidence: 86,
    recommended: false,
    color: "amber",
    whyThisOption: [
      "Reduces expected delay by 5h vs. waiting",
      "Spreads fulfillment risk across two suppliers",
      "Lower risk (39) vs. waiting (72)",
      "Partial deadline preservation likely",
    ],
    tradeoffs: [
      "Small additional sourcing cost (+₹6,500)",
      "Delivery may arrive in two separate shipments",
    ],
  },
  {
    id: "reroute",
    label: "OPTION C",
    name: "REROUTE",
    description: "Move the order to a certified alternate textile factory with full capacity available and matching quality certifications.",
    delay: "+2h",
    delaySortVal: 2,
    costImpact: "+₹18,500",
    costLabel: "Sourcing and logistics adjustment",
    risk: 24,
    confidence: 88,
    recommended: true,
    color: "emerald",
    whyThisOption: [
      "Lowest expected delay (+2h) — deadline preserved",
      "Lowest fulfillment risk (24/100)",
      "Certified alternate capacity fully available",
      "Quality certification matched for your order",
      "Single shipment — no split delivery",
    ],
    tradeoffs: [
      "Higher sourcing cost (+₹18,500)",
    ],
  },
];
