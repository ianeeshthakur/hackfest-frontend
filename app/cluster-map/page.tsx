"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

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

// --- AI Helpers ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMostRelevantFactory = (sourceFactory: any, allFactories: any[]) => {
  if (!sourceFactory) return null;
  // Exclude source, prioritize same cluster, same type, operational, then capacity
  const candidates = allFactories.filter(
    (f) => f.id !== sourceFactory.id && f.status === "OPERATIONAL"
  );
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.clusterId === sourceFactory.clusterId) scoreA += 100;
    if (b.clusterId === sourceFactory.clusterId) scoreB += 100;
    if (a.type === sourceFactory.type) scoreA += 50;
    if (b.type === sourceFactory.type) scoreB += 50;
    scoreA += a.capacity;
    scoreB += b.capacity;
    return scoreB - scoreA; // Descending
  });

  return candidates[0];
};

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

  // Cinematic AI State
  const [aiPhase, setAiPhase] = useState<"idle" | "locating" | "source-found" | "analyzing" | "alternative-found" | "connecting" | "complete">("idle");
  const [recommendedFactoryId, setRecommendedFactoryId] = useState<string | null>(null);
  const [showConnection, setShowConnection] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [aiText, setAiText] = useState("");
  const aiSequenceRef = useRef<NodeJS.Timeout | null>(null);

  const stopSequence = useCallback(() => {
    if (aiSequenceRef.current) clearTimeout(aiSequenceRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const speakAI = useCallback((text: string) => {
    setAiText(text);
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  useEffect(() => {
    return stopSequence;
  }, [stopSequence]);

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

  const runAiSequence = useCallback((orderId: string, factoryId: string, clusterId: string) => {
    stopSequence();
    handleClusterSelect(clusterId);
    setIsRecoveryFocus(true);
    setRecoveryOrder({ id: orderId, factoryId, clusterId });
    setRecommendedFactoryId(null);
    setShowConnection(false);
    setSelectedFactoryId(null);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originFactory = (factories as any[]).find(f => f.id === factoryId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recommended = originFactory ? getMostRelevantFactory(originFactory, factories as any[]) : null;

    // Phase 2: Order Detected (after 1s)
    aiSequenceRef.current = setTimeout(() => {
      setAiPhase("locating");
      speakAI(`Order ${orderId} detected. Locating the source factory.`);
      
      aiSequenceRef.current = setTimeout(() => {
        setAiPhase("source-found");
        speakAI(`Order origin identified: ${originFactory?.name || "Factory"}, ${factoryId}.`);
        
        // Phase 3: Analyzing (after 2.5s)
        aiSequenceRef.current = setTimeout(() => {
          setAiPhase("analyzing");
          speakAI(`Analyzing the supply network for the most relevant available factory.`);
          
          // Phase 4: Alternative Found (after 3.5s)
          aiSequenceRef.current = setTimeout(() => {
            if (recommended) {
              setAiPhase("alternative-found");
              setRecommendedFactoryId(recommended.id);
              speakAI(`Relevant factory identified. ${recommended.name} is the strongest available alternative.`);
              
              // Phase 5: Connecting (after 3s)
              aiSequenceRef.current = setTimeout(() => {
                setAiPhase("connecting");
                setShowConnection(true);
                speakAI(`Network relationship established. This factory can support recovery if the original factory becomes unavailable.`);
                
                // Phase 6: Complete (after 4s)
                aiSequenceRef.current = setTimeout(() => {
                  setAiPhase("complete");
                  speakAI(`Recovery alternative ready for review.`);
                }, 4000);
              }, 4000);
            } else {
              setAiPhase("complete");
              speakAI(`No relevant alternatives found in the network.`);
            }
          }, 3500);
        }, 3000);
      }, 2500);
    }, 1000);
  }, [handleClusterSelect, speakAI, stopSequence]);

  // Handle URL Params for Recovery Flow Focus
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focusReason = params.get('focusReason');
    const focusClusterId = params.get('focusClusterId');
    const orderId = params.get('orderId');
    const factoryId = params.get('factoryId');

    if (focusReason === 'ORDER_ORIGIN' && focusClusterId && orderId && factoryId) {
      setTimeout(() => {
        runAiSequence(orderId, factoryId, focusClusterId);
      }, 300);
    }
  }, [runAiSequence]);

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
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (recoveryOrder) {
                    runAiSequence(recoveryOrder.id, recoveryOrder.factoryId, recoveryOrder.clusterId);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg transition-colors border border-emerald-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay AI Analysis
              </button>
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
              recoveryFactoryId={aiPhase !== "idle" && aiPhase !== "locating" ? recoveryOrder?.factoryId : undefined}
              recommendedFactoryId={recommendedFactoryId || undefined}
              showConnection={showConnection}
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
          <NetworkCopilot 
            onIntentAction={handleVoiceIntent} 
            externalState={
              aiPhase === "analyzing" || aiPhase === "locating" ? "PROCESSING" :
              aiPhase === "complete" || aiPhase === "idle" ? "IDLE" : 
              "RESPONDING"
            }
            externalText={aiText}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => {
              setVoiceEnabled(prev => {
                if (prev) window.speechSynthesis?.cancel();
                return !prev;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
