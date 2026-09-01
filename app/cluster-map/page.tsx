"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/command-center/Sidebar";
import { ClusterOverview } from "@/components/cluster-map/ClusterOverview";
import { OverallStatus } from "@/components/cluster-map/OverallStatus";
import { MapLegend } from "@/components/cluster-map/MapLegend";
import { MapHeader } from "@/components/cluster-map/MapHeader";
import { factories, clusters, INDIA_VIEW } from "@/lib/clusterData";
import type { FilterState } from "@/components/cluster-map/types";

// Dynamically import the map (Leaflet requires browser APIs, SSR disabled)
const ClusterMap = dynamic(
  () => import("@/components/cluster-map/ClusterMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-slate-100">
        <div className="text-slate-400 text-sm">Loading map...</div>
      </div>
    ),
  }
);

const INDIA = { longitude: INDIA_VIEW.longitude, latitude: INDIA_VIEW.latitude, zoom: INDIA_VIEW.zoom };

export default function ClusterMapPage() {
  const [filters, setFilters] = useState<FilterState>({
    cluster: "all",
    type: "all",
    status: "all",
  });
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [mapView, setMapView] = useState(INDIA);

  const filteredFactories = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (factories as any[]).filter((f) => {
      const clusterMatch = filters.cluster === "all" || f.clusterId === filters.cluster;
      const typeMatch    = filters.type === "all"    || f.type === filters.type;
      const statusMatch  = filters.status === "all"  || f.status === filters.status;
      return clusterMatch && typeMatch && statusMatch;
    });
  }, [filters]);

  const handleClusterSelect = useCallback((clusterId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cluster = (clusters as any[]).find((c) => c.id === clusterId);
    if (!cluster) return;
    setSelectedClusterId(clusterId);
    setMapView({ longitude: cluster.lng, latitude: cluster.lat, zoom: cluster.zoom });
  }, []);

  const handleReset = useCallback(() => {
    setSelectedClusterId(null);
    setMapView(INDIA);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <MapHeader
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleReset}
        />
        <div className="flex-1 relative">
          <ClusterMap
            filteredFactories={filteredFactories}
            selectedClusterId={selectedClusterId}
            mapView={mapView}
            onReset={handleReset}
          />

          {/* Left floating panel */}
          <div className="absolute top-4 left-4 z-10 w-64">
            <ClusterOverview
              factories={filteredFactories}
              selectedClusterId={selectedClusterId}
              onClusterSelect={handleClusterSelect}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Right floating panel */}
          <div className="absolute top-4 right-4 z-10 w-52">
            <OverallStatus
              factories={filteredFactories}
              totalClusters={clusters.length}
            />
          </div>

          {/* Bottom-right legend */}
          <div className="absolute bottom-8 right-4 z-10">
            <MapLegend />
          </div>
        </div>
      </div>
    </div>
  );
}
