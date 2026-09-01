export interface Factory {
  id: string;
  name: string;
  clusterId: string;
  type: string;
  latitude: number;
  longitude: number;
  status: "OPERATIONAL" | "WARNING" | "DOWN";
  capacity: number;
  disruption: string | null;
}

export interface Cluster {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
}

export interface FilterState {
  cluster: string;
  type: string;
  status: string;
}
