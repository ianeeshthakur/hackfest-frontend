// ─────────────────────────────────────────────────────────────────────────────
// ThreadLine — Textile MSME Cluster Map Mock Data
// ─────────────────────────────────────────────────────────────────────────────
// Structure mirrors the future Spring Boot API responses:
//   GET /api/clusters   → clusters[]
//   GET /api/factories  → factories[]
//
// To migrate to the real backend, replace these arrays with API responses
// without changing any UI component logic.
// ─────────────────────────────────────────────────────────────────────────────

// ── Clusters ─────────────────────────────────────────────────────────────────

export const clusters = [
  {
    id: "surat",
    name: "Surat Cluster",
    city: "Surat",
    state: "Gujarat",
    lat: 21.1702,
    lng: 72.8311,
    zoom: 11,
  },
  {
    id: "tiruppur",
    name: "Tiruppur Cluster",
    city: "Tiruppur",
    state: "Tamil Nadu",
    lat: 11.1085,
    lng: 77.3411,
    zoom: 11,
  },
  {
    id: "ludhiana",
    name: "Ludhiana Cluster",
    city: "Ludhiana",
    state: "Punjab",
    lat: 30.901,
    lng: 75.8573,
    zoom: 11,
  },
];

// ── Cluster GeoJSON Polygons ──────────────────────────────────────────────────

export const clusterPolygons = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "surat",
      properties: { clusterId: "surat", name: "Surat Cluster" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [72.77, 21.22], [72.84, 21.25], [72.91, 21.22],
          [72.93, 21.16], [72.90, 21.10], [72.83, 21.08],
          [72.76, 21.11], [72.74, 21.17], [72.77, 21.22],
        ]],
      },
    },
    {
      type: "Feature",
      id: "tiruppur",
      properties: { clusterId: "tiruppur", name: "Tiruppur Cluster" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.28, 11.16], [77.35, 11.18], [77.42, 11.15],
          [77.43, 11.08], [77.38, 11.03], [77.30, 11.02],
          [77.24, 11.06], [77.25, 11.13], [77.28, 11.16],
        ]],
      },
    },
    {
      type: "Feature",
      id: "ludhiana",
      properties: { clusterId: "ludhiana", name: "Ludhiana Cluster" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.80, 30.96], [75.88, 30.97], [75.94, 30.93],
          [75.93, 30.86], [75.86, 30.83], [75.79, 30.84],
          [75.75, 30.88], [75.77, 30.94], [75.80, 30.96],
        ]],
      },
    },
  ],
};

// ── Factories ─────────────────────────────────────────────────────────────────
// 37 total: Surat (12), Tiruppur (15), Ludhiana (10). 2 DOWN.

export const factories = [
  // ── Surat Cluster (12) ─────────────────────────────────────────────────
  { id:"F-001", name:"Surat Silk Spinning Unit", clusterId:"surat", type:"Spinning", latitude:21.185, longitude:72.815, status:"OPERATIONAL", capacity:18000, currentLoad:87, orders:2, token:"F-ZS733", disruption:null },
  { id:"F-002", name:"Surat Diamond Weaving Mill", clusterId:"surat", type:"Weaving", latitude:21.178, longitude:72.838, status:"OPERATIONAL", capacity:22000, currentLoad:63, orders:1, token:"F-SEL2M", disruption:null },
  { id:"F-003", name:"Surat Polyester Dyeing Plant", clusterId:"surat", type:"Dyeing", latitude:21.162, longitude:72.852, status:"DOWN", capacity:9000, currentLoad:74, orders:2, token:"F-L0Y05", disruption:"Effluent treatment plant breakdown" },
  { id:"F-004", name:"Surat Modern Printing Works", clusterId:"surat", type:"Printing", latitude:21.155, longitude:72.822, status:"OPERATIONAL", capacity:14000, currentLoad:85, orders:3, token:"F-EMCZO", disruption:null },
  { id:"F-005", name:"Surat Finishing House A", clusterId:"surat", type:"Finishing", latitude:21.170, longitude:72.806, status:"OPERATIONAL", capacity:11000, currentLoad:61, orders:6, token:"F-77PX7", disruption:null },
  { id:"F-006", name:"Surat Garmenting Zone-1", clusterId:"surat", type:"Garmenting", latitude:21.192, longitude:72.845, status:"WARNING", capacity:7500, currentLoad:72, orders:5, token:"F-0T3VQ", disruption:"Labour shortage — 30% workforce absent" },
  { id:"F-007", name:"Surat Premier Spinning Co.", clusterId:"surat", type:"Spinning", latitude:21.198, longitude:72.828, status:"OPERATIONAL", capacity:16000, currentLoad:83, orders:6, token:"F-TFHU9", disruption:null },
  { id:"F-008", name:"Surat Jacquard Weaving Hub", clusterId:"surat", type:"Weaving", latitude:21.145, longitude:72.840, status:"OPERATIONAL", capacity:19500, currentLoad:94, orders:7, token:"F-M1USS", disruption:null },
  { id:"F-009", name:"Surat Embroidery Printing Works", clusterId:"surat", type:"Printing", latitude:21.160, longitude:72.810, status:"OPERATIONAL", capacity:12000, currentLoad:70, orders:8, token:"F-FN8QB", disruption:null },
  { id:"F-010", name:"Surat Export Garmenting Unit", clusterId:"surat", type:"Garmenting", latitude:21.182, longitude:72.860, status:"OPERATIONAL", capacity:8500, currentLoad:67, orders:6, token:"F-5YJRW", disruption:null },
  { id:"F-011", name:"Surat Knitted Fabric Mill", clusterId:"surat", type:"Knitting", latitude:21.175, longitude:72.793, status:"OPERATIONAL", capacity:10500, currentLoad:78, orders:7, token:"F-YKXPF", disruption:null },
  { id:"F-012", name:"Surat Premium Finishing Plant", clusterId:"surat", type:"Finishing", latitude:21.152, longitude:72.863, status:"OPERATIONAL", capacity:13000, currentLoad:89, orders:8, token:"F-R6AOY", disruption:null },

  // ── Tiruppur Cluster (15) ───────────────────────────────────────────────
  { id:"F-013", name:"Tiruppur Cotton Spinning Mill", clusterId:"tiruppur", type:"Spinning", latitude:11.118, longitude:77.315, status:"OPERATIONAL", capacity:21000, currentLoad:65, orders:1, token:"F-KSOMH", disruption:null },
  { id:"F-014", name:"Tiruppur Knitwear Factory A", clusterId:"tiruppur", type:"Knitting", latitude:11.125, longitude:77.335, status:"OPERATIONAL", capacity:15000, currentLoad:76, orders:8, token:"F-DE2K0", disruption:null },
  { id:"F-015", name:"Tiruppur Knit Dyeing Unit", clusterId:"tiruppur", type:"Dyeing", latitude:11.105, longitude:77.355, status:"DOWN", capacity:8000, currentLoad:87, orders:3, token:"F-6ZFJJ", disruption:"Water supply disruption — municipal shutdown" },
  { id:"F-016", name:"Tiruppur Hosiery Finishing Hub", clusterId:"tiruppur", type:"Finishing", latitude:11.098, longitude:77.340, status:"OPERATIONAL", capacity:17000, currentLoad:63, orders:4, token:"F-ZLTH2", disruption:null },
  { id:"F-017", name:"Tiruppur T-Shirt Garmenting Unit", clusterId:"tiruppur", type:"Garmenting", latitude:11.115, longitude:77.360, status:"OPERATIONAL", capacity:9000, currentLoad:74, orders:5, token:"F-S76FL", disruption:null },
  { id:"F-018", name:"Tiruppur Inner Knitwear Unit", clusterId:"tiruppur", type:"Knitting", latitude:11.128, longitude:77.328, status:"OPERATIONAL", capacity:13000, currentLoad:85, orders:4, token:"F-LTKE4", disruption:null },
  { id:"F-019", name:"Tiruppur Spinning Works No.2", clusterId:"tiruppur", type:"Spinning", latitude:11.112, longitude:77.305, status:"OPERATIONAL", capacity:19000, currentLoad:61, orders:3, token:"F-EFYCN", disruption:null },
  { id:"F-020", name:"Tiruppur Reactive Printing Unit", clusterId:"tiruppur", type:"Printing", latitude:11.095, longitude:77.320, status:"WARNING", capacity:11000, currentLoad:93, orders:5, token:"F-GTA7B", disruption:"Ink pigment supply delayed — 2 days" },
  { id:"F-021", name:"Tiruppur Stretch Knit Factory", clusterId:"tiruppur", type:"Knitting", latitude:11.135, longitude:77.348, status:"OPERATIONAL", capacity:14500, currentLoad:69, orders:4, token:"F-N7W8S", disruption:null },
  { id:"F-022", name:"Tiruppur Garment Export Zone", clusterId:"tiruppur", type:"Garmenting", latitude:11.102, longitude:77.365, status:"OPERATIONAL", capacity:10500, currentLoad:80, orders:3, token:"F-ULJAA", disruption:null },
  { id:"F-023", name:"Tiruppur Circular Knitting Co.", clusterId:"tiruppur", type:"Knitting", latitude:11.090, longitude:77.345, status:"OPERATIONAL", capacity:16000, currentLoad:91, orders:8, token:"F-1Z5BR", disruption:null },
  { id:"F-024", name:"Tiruppur Sportswear Garmenting", clusterId:"tiruppur", type:"Garmenting", latitude:11.120, longitude:77.375, status:"OPERATIONAL", capacity:8000, currentLoad:67, orders:1, token:"F-8DSD8", disruption:null },
  { id:"F-025", name:"Tiruppur Eco Dyeing Works", clusterId:"tiruppur", type:"Dyeing", latitude:11.140, longitude:77.320, status:"OPERATIONAL", capacity:12000, currentLoad:78, orders:2, token:"F-FSEFP", disruption:null },
  { id:"F-026", name:"Tiruppur Export Finishing Plant", clusterId:"tiruppur", type:"Finishing", latitude:11.108, longitude:77.332, status:"OPERATIONAL", capacity:15500, currentLoad:89, orders:7, token:"F-M60G6", disruption:null },
  { id:"F-027", name:"Tiruppur Premium Weave Mill", clusterId:"tiruppur", type:"Weaving", latitude:11.085, longitude:77.356, status:"OPERATIONAL", capacity:18000, currentLoad:65, orders:6, token:"F-TKNIN", disruption:null },

  // ── Ludhiana Cluster (10) ───────────────────────────────────────────────
  { id:"F-028", name:"Ludhiana Woolen Spinning Unit", clusterId:"ludhiana", type:"Spinning", latitude:30.918, longitude:75.838, status:"OPERATIONAL", capacity:17000, currentLoad:76, orders:5, token:"F-0Y9J4", disruption:null },
  { id:"F-029", name:"Ludhiana Knitting Unit A", clusterId:"ludhiana", type:"Knitting", latitude:30.908, longitude:75.852, status:"OPERATIONAL", capacity:12000, currentLoad:87, orders:6, token:"F-7CWLL", disruption:null },
  { id:"F-030", name:"Ludhiana Hosiery Finishing", clusterId:"ludhiana", type:"Finishing", latitude:30.895, longitude:75.862, status:"OPERATIONAL", capacity:14000, currentLoad:84, orders:6, token:"F-H1KL0", disruption:null },
  { id:"F-031", name:"Ludhiana Acrylic Dyeing Plant", clusterId:"ludhiana", type:"Dyeing", latitude:30.888, longitude:75.848, status:"OPERATIONAL", capacity:9500, currentLoad:60, orders:5, token:"F-OF7MH", disruption:null },
  { id:"F-032", name:"Ludhiana Sweater Garmenting Unit", clusterId:"ludhiana", type:"Garmenting", latitude:30.900, longitude:75.870, status:"OPERATIONAL", capacity:7000, currentLoad:71, orders:6, token:"F-VTTOY", disruption:null },
  { id:"F-033", name:"Ludhiana Knitwear Printing Co.", clusterId:"ludhiana", type:"Printing", latitude:30.912, longitude:75.878, status:"OPERATIONAL", capacity:11000, currentLoad:82, orders:7, token:"F-27FQF", disruption:null },
  { id:"F-034", name:"Ludhiana Fine Weaving Mill", clusterId:"ludhiana", type:"Weaving", latitude:30.922, longitude:75.858, status:"OPERATIONAL", capacity:16000, currentLoad:93, orders:2, token:"F-9L2RW", disruption:null },
  { id:"F-035", name:"Ludhiana Sports Knitting Factory", clusterId:"ludhiana", type:"Knitting", latitude:30.885, longitude:75.835, status:"OPERATIONAL", capacity:13500, currentLoad:69, orders:1, token:"F-G0OTD", disruption:null },
  { id:"F-036", name:"Ludhiana Thermal Wear Unit", clusterId:"ludhiana", type:"Garmenting", latitude:30.875, longitude:75.855, status:"OPERATIONAL", capacity:8500, currentLoad:80, orders:2, token:"F-NEBVU", disruption:null },
  { id:"F-037", name:"Ludhiana Carpet Weaving Works", clusterId:"ludhiana", type:"Weaving", latitude:30.935, longitude:75.848, status:"OPERATIONAL", capacity:20000, currentLoad:91, orders:3, token:"F-USXWB", disruption:null },
];

// ── Constants ─────────────────────────────────────────────────────────────────

export const FACTORY_TYPES = [
  "Spinning", "Weaving", "Knitting", "Dyeing", "Printing", "Finishing", "Garmenting",
];

export const STATUS_OPTIONS = ["OPERATIONAL", "WARNING", "DOWN"];

// Default map view — India overview showing all 3 clusters
export const INDIA_VIEW = {
  longitude: 78.9629,
  latitude: 20.5937,
  zoom: 4.5,
};

// ── Global State Mutators ─────────────────────────────────────────────────────

/**
 * Mutates the global in-memory factories array to simulate a disruption.
 * Since Next.js preserves module memory across client-side navigation, 
 * this state will be reusable by the Global Control Tower and Cluster Map.
 */
export function simulateDisruption(factoryId, type) {
  const factory = factories.find(f => f.id === factoryId);
  if (!factory) return null;

  if (type === "Power Cut") {
    factory.status = "WARNING";
    factory.disruption = "Power grid failure - Backup generator engaged";
    factory.capacity = Math.floor(factory.capacity * 0.72); // -28% capacity
  } else if (type === "Machine Breakdown") {
    factory.status = "DOWN";
    factory.disruption = "Critical machine failure on Line 3";
    factory.capacity = Math.floor(factory.capacity * 0.40); 
  } else if (type === "Worker Shortage") {
    factory.status = "WARNING";
    factory.disruption = "Labour shortage — 30% workforce absent";
    factory.capacity = Math.floor(factory.capacity * 0.70);
  } else if (type === "Raw Material Delay") {
    factory.status = "WARNING";
    factory.disruption = "Yarn shipment delayed by 48 hours";
    factory.capacity = Math.floor(factory.capacity * 0.85);
  } else {
    // Reset
    factory.status = "OPERATIONAL";
    factory.disruption = null;
    factory.capacity = 21000; // Reset to original (for F-013)
  }

  return factory;
}
