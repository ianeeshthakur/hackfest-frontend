"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/command-center/Sidebar";
import { ClusterOverview } from "@/components/cluster-map/ClusterOverview";
import { OverallStatus } from "@/components/cluster-map/OverallStatus";
import { MapLegend } from "@/components/cluster-map/MapLegend";
import { MapHeader } from "@/components/cluster-map/MapHeader";
import { FactoryDetails } from "@/components/cluster-map/FactoryDetails";
import { AlternativesPanel } from "@/components/cluster-map/AlternativesPanel";
import { NetworkCopilot } from "@/components/cluster-map/NetworkCopilot";
import { factories, clusters, INDIA_VIEW } from "@/lib/clusterData";
import { updateContext } from "@/lib/voiceCommands";
import { useRole } from "@/lib/roleContext";
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
  const router = useRouter();
  const { role } = useRole();
  const isBuyer = role === "buyer";
  const [filters, setFilters] = useState<FilterState>({
    cluster: "all",
    type: "all",
    status: "all",
  });
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [mapView, setMapView] = useState(INDIA);

  const [activeModal, setActiveModal] = useState<"details" | "alternatives" | null>(null);
  const [activeFactoryId, setActiveFactoryId] = useState<string | null>(null);

  // Map state lifted from ClusterMap
  const [selectedFactoryId, setSelectedFactoryId] = useState<string | null>(null);
  const [clusterPopupInfo, setClusterPopupInfo] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cluster: any;
    position: { lat: number; lng: number };
  } | null>(null);

  // Recovery Flow State
  const [isRecoveryFocus, setIsRecoveryFocus] = useState(false);
  const [recoveryOrder, setRecoveryOrder] = useState<{ id: string, factoryId: string, clusterId: string } | null>(null);

  const activeFactory = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return activeFactoryId ? (factories as any[]).find(f => f.id === activeFactoryId) : null;
  }, [activeFactoryId]);

  const filteredFactories = useMemo(() => {
    return (factories as any[]).filter((f) => {
      // Removed hardcoded buyer filter so all factories are returned.
      // The buyer view restriction should happen at the inspector/popup level.
      
      const clusterMatch = filters.cluster === "all" || f.clusterId === filters.cluster;
      const typeMatch    = filters.type === "all"    || f.type === filters.type;
      const statusMatch  = filters.status === "all"  || f.status === filters.status;
      return clusterMatch && typeMatch && statusMatch;
    });
  }, [filters, isBuyer]);

  const handleClusterSelect = useCallback((clusterId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cluster = (clusters as any[]).find((c) => c.id === clusterId);
    if (!cluster) return;
    setSelectedClusterId(clusterId);
    updateContext("lastClusterId", clusterId);
    setMapView({ longitude: cluster.lng, latitude: cluster.lat, zoom: cluster.zoom });
  }, []);

  const handleReset = useCallback(() => {
    setSelectedClusterId(null);
    setMapView(INDIA);
    setSelectedFactoryId(null);
    setClusterPopupInfo(null);
    updateContext("lastClusterId", null);
    updateContext("lastFactoryId", null);
    setIsRecoveryFocus(false);
  }, []);

  // Handle URL Params for Recovery Flow Focus
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focusReason = params.get('focusReason');
    const focusClusterId = params.get('focusClusterId');
    const orderId = params.get('orderId');
    const factoryId = params.get('factoryId');

    if (focusReason === 'ORDER_ORIGIN' && focusClusterId) {
      setTimeout(() => {
        handleClusterSelect(focusClusterId);
        setIsRecoveryFocus(true);
        if (orderId && factoryId) {
          setRecoveryOrder({ id: orderId, factoryId, clusterId: focusClusterId });
          // Note: The factory highlighting logic will be handled inside ClusterMap or by setting selectedFactoryId
          // Delaying selectedFactoryId slightly so map flyTo happens first
          setTimeout(() => {
             setSelectedFactoryId(factoryId);
          }, 1400); // Wait for the 1.2s map flyTo animation to finish
        }
      }, 300);
    }
  }, [handleClusterSelect]);

  const handleVoiceIntent = useCallback((result: { intent: string; payload: any }) => {
    const { intent, payload } = result;
    
    if (intent === "SHOW_CLUSTER" || intent === "SHOW_CLUSTER_STATUS") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cluster = (clusters as any[]).find(c => c.id === payload.clusterId);
      if (cluster) {
        setSelectedClusterId(cluster.id);
        setMapView({ longitude: cluster.lng, latitude: cluster.lat, zoom: cluster.zoom });
        setClusterPopupInfo({ cluster, position: { lat: cluster.lat, lng: cluster.lng } });
        setSelectedFactoryId(null);
        setActiveModal(null);
      }
    } else if (intent === "EXPLAIN_DISRUPTION" || intent === "HIGHLIGHT_FACTORY") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const factory = (factories as any[]).find(f => f.id === payload.factoryId);
      if (factory) {
        setSelectedFactoryId(factory.id);
        setClusterPopupInfo(null);
        // Ensure the factory is in view, zoom in a bit
        setMapView({ longitude: factory.longitude, latitude: factory.latitude, zoom: 12 });
      }
    } else if (intent === "SHOW_ALTERNATIVES") {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const factory = (factories as any[]).find(f => f.id === payload.factoryId);
       if (factory) {
         setActiveFactoryId(factory.id);
         setActiveModal('alternatives');
       }
    } else if (intent === "RESET_MAP") {
       handleReset();
       setActiveModal(null);
    } else if (intent === "NONE") {
       // Just speak, no map action needed
    }
  }, [handleReset]);

  return (
    <div className="cc-light-root flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {isBuyer && !isRecoveryFocus && <div className="bg-sky-500 text-white text-xs font-bold px-4 py-1.5 text-center flex items-center justify-center gap-2 tracking-widest uppercase"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Buyer View: Network Filtered to Recovery Options</div>}
        
        {/* Recovery Focus Banner */}
        {isRecoveryFocus && recoveryOrder && (
          <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800 shadow-md z-10 relative">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-emerald-500/20 text-emerald-400 w-8 h-8 rounded-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Order Origin</div>
                <div className="text-sm font-semibold">
                  {recoveryOrder.id} · Factory {recoveryOrder.factoryId} · {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (clusters as any[]).find((c) => c.id === recoveryOrder.clusterId)?.name || 'Cluster'
                  }
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                handleReset();
                router.replace('/cluster-map');
              }}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/10"
            >
              View All Clusters
            </button>
          </div>
        )}

        <MapHeader
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleReset}
        />
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Panel */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 flex flex-col shrink-0">
            <ClusterOverview
              factories={filteredFactories}
              selectedClusterId={selectedClusterId}
              onClusterSelect={handleClusterSelect}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Map Area */}
          <div className="flex-1 relative overflow-hidden">
            <ClusterMap
              filteredFactories={filteredFactories}
              selectedClusterId={selectedClusterId}
              mapView={mapView}
              onReset={handleReset}
              onViewFactory={(id) => { setActiveFactoryId(id); setActiveModal('details'); }}
              onFindAlternatives={(id) => { setActiveFactoryId(id); setActiveModal('alternatives'); }}
              selectedFactoryId={selectedFactoryId}
              recoveryFactoryId={recoveryOrder?.factoryId}
              onSelectFactory={(id) => {
                setSelectedFactoryId(id);
                if (id) updateContext("lastFactoryId", id);
              }}
              clusterPopupInfo={clusterPopupInfo}
              onSetClusterPopupInfo={(info) => {
                setClusterPopupInfo(info);
                if (info) updateContext("lastClusterId", info.cluster.id);
              }}
            />

            {/* Bottom-right legend */}
            <div className="absolute bottom-8 right-8 z-10">
              <MapLegend />
            </div>

            {/* Modals */}
            {activeModal === 'details' && activeFactory && (
              <FactoryDetails factory={activeFactory} onClose={() => setActiveModal(null)} />
            )}
            
            {activeModal === 'alternatives' && activeFactory && (
              <AlternativesPanel 
                disruptedFactory={activeFactory} 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                allFactories={factories as any[]} 
                onClose={() => setActiveModal(null)} 
              />
            )}
          </div>

          {/* Right Panel */}
          <div className="w-64 bg-slate-50 border-l border-slate-200 overflow-y-auto p-4 flex flex-col shrink-0">
            <OverallStatus
              factories={filteredFactories}
              totalClusters={clusters.length}
            />
          </div>

          {/* Floating AI Assistant (shifted right to avoid map clusters) */}
          <NetworkCopilot onIntentAction={handleVoiceIntent} />
        </div>
      </div>
    </div>
  );
}
