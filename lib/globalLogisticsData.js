// Mock data for Global Logistics / Shipment Journey Simulation

export const ORDER_DETAILS = {
  id: "4521",
  origin: "Tiruppur",
  destination: "Hamburg",
  vessel: "Ocean vessel",
  status: "live simulation"
};

export const ORIGINAL_ROUTE = [
  { id: "tiruppur", name: "Tiruppur", type: "origin" },
  { id: "nhava_sheva", name: "Nhava Sheva", type: "port" },
  { id: "arabian_sea", name: "Arabian Sea", type: "transit" },
  { id: "suez_canal", name: "Suez Canal", type: "transit" },
  { id: "hamburg", name: "Hamburg", type: "destination" }
];

export const ALTERNATE_ROUTE = [
  { id: "tiruppur", name: "Tiruppur", type: "origin" },
  { id: "mundra", name: "Mundra Port", type: "port", isAlternate: true },
  { id: "arabian_sea", name: "Arabian Sea", type: "transit" },
  { id: "suez_canal", name: "Suez Canal", type: "transit" },
  { id: "hamburg", name: "Hamburg", type: "destination" }
];

export const METRICS = {
  totalDistance: 8420,
  initialInTransit: 14,
  initialPortExposure: 4,
  initialRouteHealth: 62.4
};
