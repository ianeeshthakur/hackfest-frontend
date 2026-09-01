// ─────────────────────────────────────────────────────────────────────────────
// False Diversification Intelligence Data
// ─────────────────────────────────────────────────────────────────────────────
// ThreadLine detects factories that appear independent but share upstream
// dependencies — creating hidden, concentrated supply chain risk.
// ─────────────────────────────────────────────────────────────────────────────

export const FALSE_DIV_SUMMARY = {
  totalClusters: 2,
  totalSharedSuppliers: 3,
  totalExposedFactories: 7,
  totalExposedOrders: 14,
  networkRisk: "HIGH",
  detectedAt: "Sep 01, 21:30",
  confidence: 94,
};

export const FALSE_DIV_CASES = [
  {
    id: "fd-001",
    severity: "CRITICAL",
    sharedSupplier: {
      name: "ABC Yarn Supplier",
      location: "Panipat, Haryana",
      supplierId: "SUP-Y-041",
      supplyType: "Raw Yarn (Cotton & Polyester Blend)",
      singlePointOfFailure: true,
    },
    affectedFactories: [
      { id: "F-013", name: "Suresh Textiles", location: "Tiruppur, TN",   cluster: "Tiruppur", status: "DISRUPTED", supplyShare: 78 },
      { id: "F-022", name: "Krishna Weaves",  location: "Surat, GJ",      cluster: "Surat",    status: "OPERATIONAL", supplyShare: 64 },
      { id: "F-031", name: "Mehta Spinning",  location: "Ludhiana, PB",   cluster: "Ludhiana", status: "OPERATIONAL", supplyShare: 55 },
    ],
    affectedOrders: ["TX-2048", "TX-3011", "TX-4402", "TX-5110", "TX-6003", "TX-7201", "TX-8840"],
    networkRisk: "HIGH",
    networkRiskScore: 78,
    hiddenRisk: "All 3 factories appear geographically diversified (3 states, 2 clusters) but source 55–78% of their raw yarn from a single upstream supplier.",
    cascadeScenario: "If ABC Yarn Supplier faces a disruption, all 3 factories halt simultaneously — eliminating the perceived geographic diversification benefit.",
    whyItMatters: "Factories may appear geographically independent while sharing the same upstream dependency. A buyer or operator evaluating factory-level redundancy would conclude they are protected — but a single upstream disruption would cascade across all factories simultaneously.",
    recommendation: "Source from at least 2 independent yarn suppliers across different geographic and corporate supply chains.",
  },
  {
    id: "fd-002",
    severity: "HIGH",
    sharedSupplier: {
      name: "IndoDye Chemicals",
      location: "Vapi, Gujarat",
      supplierId: "SUP-D-019",
      supplyType: "Chemical Dyes & Finishing Agents",
      singlePointOfFailure: false,
    },
    affectedFactories: [
      { id: "F-007", name: "Ravi Dyeing Co.",  location: "Surat, GJ",    cluster: "Surat",    status: "OPERATIONAL", supplyShare: 91 },
      { id: "F-019", name: "Agarwal Finishers", location: "Surat, GJ",   cluster: "Surat",    status: "WARNING",     supplyShare: 83 },
      { id: "F-040", name: "Patel Print House", location: "Ahmedabad, GJ", cluster: "Surat",  status: "OPERATIONAL", supplyShare: 70 },
      { id: "F-028", name: "Shah Textiles",     location: "Tiruppur, TN", cluster: "Tiruppur", status: "OPERATIONAL", supplyShare: 45 },
    ],
    affectedOrders: ["TX-1193", "TX-2984", "TX-4011", "TX-5521", "TX-6678", "TX-7001", "TX-8120"],
    networkRisk: "HIGH",
    networkRiskScore: 64,
    hiddenRisk: "4 factories across 2 geographic clusters all depend on a single chemical dye supplier, representing a hidden regulatory and logistics chokepoint.",
    cascadeScenario: "REACH/BIS regulatory action or logistics disruption at Vapi GIDC would simultaneously halt dyeing operations across the network.",
    whyItMatters: "Chemical supply dependencies are frequently invisible in factory-level due diligence. A GIDC-level shutdown, environmental violation, or transport embargo would cascade instantly.",
    recommendation: "Establish secondary chemical supplier agreements in Bhiwandi or Tirupur dye clusters to reduce single-region dependency.",
  },
  {
    id: "fd-003",
    severity: "MEDIUM",
    sharedSupplier: {
      name: "Sigma Logistics Hub",
      location: "Delhi NCR",
      supplierId: "SUP-L-007",
      supplyType: "Inbound Freight & Last-Mile Logistics",
      singlePointOfFailure: false,
    },
    affectedFactories: [
      { id: "F-003", name: "Kapoor Knitting", location: "Ludhiana, PB",  cluster: "Ludhiana", status: "OPERATIONAL", supplyShare: 88 },
      { id: "F-011", name: "Verma Looms",     location: "Panipat, HR",   cluster: "Ludhiana", status: "OPERATIONAL", supplyShare: 72 },
    ],
    affectedOrders: ["TX-9010", "TX-9340", "TX-9771", "TX-9980", "TX-10110", "TX-10303", "TX-11040"],
    networkRisk: "MEDIUM",
    networkRiskScore: 43,
    hiddenRisk: "2 factories in the Northern cluster share the same last-mile logistics provider, concentrating outbound delivery risk.",
    cascadeScenario: "Strike action or fleet disruption at Sigma Logistics Hub would delay shipments from both factories simultaneously.",
    whyItMatters: "Logistics diversification is often overlooked in network resilience planning — but a single logistics partner failure can mirror the impact of factory-level disruptions.",
    recommendation: "Onboard a secondary logistics partner for the Northern cluster to ensure outbound delivery redundancy.",
  },
];
