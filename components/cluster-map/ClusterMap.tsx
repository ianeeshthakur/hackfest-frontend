"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ClusterMap — Interactive Leaflet map for Textile MSME Cluster visualization
// Uses react-leaflet v4 + OpenStreetMap tiles (no API key required)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { clusters, clusterPolygons, INDIA_VIEW } from "@/lib/clusterData";
import { createFactoryIcon, createClusterLabelIcon } from "./FactoryMarker";
import { FactoryPopup } from "./FactoryPopup";
import { ClusterPopup } from "./ClusterPopup";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

// ─── Type definitions ────────────────────────────────────────────────────────

interface Factory {
  id: string;
  name: string;
  clusterId: string;
  type: string;
  latitude: number;
  longitude: number;
  status: string;
  capacity: number;
  currentLoad: number;
  orders: number;
  token: string;
  disruption: string | null;
}

interface ClusterData {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
}

interface MapView {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface ClusterMapProps {
  filteredFactories: Factory[];
  selectedClusterId: string | null;
  mapView: MapView;
  onMapViewChange?: (v: MapView) => void;
  onReset: () => void;
  onViewFactory: (factoryId: string) => void;
  onFindAlternatives: (factoryId: string) => void;
  selectedFactoryId: string | null;
  onSelectFactory: (id: string | null) => void;
  clusterPopupInfo: { cluster: ClusterData; position: { lat: number; lng: number } } | null;
  onSetClusterPopupInfo: (info: { cluster: ClusterData; position: { lat: number; lng: number } } | null) => void;
  recoveryFactoryId?: string;
  recommendedFactoryId?: string;
  showConnection?: boolean;
}

// ─── Child: flies the map to a new view when mapView prop changes ─────────────

function MapViewController({ mapView }: { mapView: MapView }) {
  const map = useMap();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    map.flyTo([mapView.latitude, mapView.longitude], mapView.zoom, {
      animate: true,
      duration: 1.2,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, mapView.latitude, mapView.longitude, mapView.zoom]);

  return null;
}

// ─── Child: captures map ref for external controls ───────────────────────────

function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

// ─── Child: adjusts map bounds to fit two points ──────────────────────────────

function MapFitBounds({ points, isActive }: { points: [number, number][], isActive: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (isActive && points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 13 });
    }
  }, [map, points, isActive]);
  return null;
}

// ─── Child: closes popups on bare map click ───────────────────────────────────

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: onMapClick });
  return null;
}

// ─── Control button ───────────────────────────────────────────────────────────

function ControlBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ClusterMap({
  filteredFactories,
  selectedClusterId,
  mapView,
  onReset,
  onViewFactory,
  onFindAlternatives,
  selectedFactoryId,
  onSelectFactory,
  clusterPopupInfo,
  onSetClusterPopupInfo,
  recoveryFactoryId,
  recommendedFactoryId,
  showConnection,
}: ClusterMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Derive the selected factory object from id
  const selectedFactory = filteredFactories.find((f) => f.id === selectedFactoryId) ?? null;
  const originFactory = filteredFactories.find((f) => f.id === recoveryFactoryId) ?? null;
  const recommendedFactory = filteredFactories.find((f) => f.id === recommendedFactoryId) ?? null;
  
  // Clear selected factory when it is filtered out
  useEffect(() => {
    if (selectedFactoryId && !filteredFactories.find((f) => f.id === selectedFactoryId)) {
      onSelectFactory(null);
    }
  }, [filteredFactories, selectedFactoryId, onSelectFactory]);

  const handleFactoryClick = useCallback(
    (e: { originalEvent?: Event }, factory: Factory) => {
      e.originalEvent?.stopPropagation();
      onSelectFactory(factory.id);
      onSetClusterPopupInfo(null);
    },
    [onSelectFactory, onSetClusterPopupInfo]
  );

  const handleClusterClick = useCallback((clusterId: string) => {
    const cluster = (clusters as ClusterData[]).find((c) => c.id === clusterId);
    if (!cluster) return;
    onSetClusterPopupInfo({ cluster, position: { lat: cluster.lat, lng: cluster.lng } });
    onSelectFactory(null);
  }, [onSetClusterPopupInfo, onSelectFactory]);

  const handleMapClick = useCallback(() => {
    onSelectFactory(null);
    onSetClusterPopupInfo(null);
  }, [onSelectFactory, onSetClusterPopupInfo]);

  const handleReset = useCallback(() => {
    onSelectFactory(null);
    onSetClusterPopupInfo(null);
    onReset();
  }, [onReset, onSelectFactory, onSetClusterPopupInfo]);

  return (
    <div className="absolute inset-0">
      {/* ── Leaflet map ────────────────────────────────────────────────────── */}
      <MapContainer
        center={[INDIA_VIEW.latitude, INDIA_VIEW.longitude]}
        zoom={INDIA_VIEW.zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={true}
      >
        {/* OpenStreetMap base tiles — free, no token required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Internal helpers */}
        <MapViewController mapView={mapView} />
        <MapRefCapture mapRef={mapRef} />
        <MapClickHandler onMapClick={handleMapClick} />
        <MapFitBounds 
          isActive={!!(showConnection && originFactory && recommendedFactory)} 
          points={
            originFactory && recommendedFactory 
              ? [[originFactory.latitude, originFactory.longitude], [recommendedFactory.latitude, recommendedFactory.longitude]] 
              : []
          } 
        />

        {/* ── Cluster polygon boundaries ──────────────────────────────────── */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(clusterPolygons as any).features.map((feature: any) => {
          const isSelectedCluster = selectedClusterId === feature.id;
          return (
            <GeoJSON
              key={`${feature.id as string}-${selectedClusterId ?? "none"}`}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data={feature as any}
              style={() => ({
                color: "#16a34a",
                weight: isSelectedCluster ? 2.5 : 1.8,
                opacity: 0.85,
                fillColor: "#16a34a",
                fillOpacity: isSelectedCluster ? 0.18 : 0.07,
                dashArray: "6, 4",
                lineJoin: "round" as CanvasLineJoin,
              })}
              eventHandlers={{
                click: (e) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (e as any).originalEvent?.stopPropagation();
                  handleClusterClick(feature.properties.clusterId as string);
                },
              }}
            />
          );
        })}

        {/* ── Cluster floating labels ─────────────────────────────────────── */}
        {(clusters as ClusterData[]).map((cluster) => (
          <Marker
            key={`label-${cluster.id}`}
            position={[cluster.lat + 0.09, cluster.lng]}
            icon={createClusterLabelIcon(cluster.name)}
            zIndexOffset={200}
            eventHandlers={{
              click: (e) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (e as any).originalEvent?.stopPropagation();
                handleClusterClick(cluster.id);
              },
            }}
          />
        ))}

        {/* ── Factory markers ─────────────────────────────────────────────── */}
        {filteredFactories.map((factory) => {
          const isSelected = selectedFactoryId === factory.id;
          const isRecoveryOrigin = recoveryFactoryId === factory.id;
          const isAiRecommended = recommendedFactoryId === factory.id;
          return (
            <Marker
              key={factory.id}
              position={[factory.latitude, factory.longitude]}
              icon={createFactoryIcon(factory, isSelected, isRecoveryOrigin, isAiRecommended)}
              zIndexOffset={isSelected || isRecoveryOrigin || isAiRecommended ? 1000 : 500}
              eventHandlers={{
                click: (e) => handleFactoryClick(e as { originalEvent?: Event }, factory),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -16]}
                opacity={1}
                className="factory-tooltip"
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 2, color: "#0f172a" }}>
                    {factory.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>
                    {factory.type}&nbsp;&middot;&nbsp;
                    <span
                      style={{
                        color:
                          factory.status === "DOWN"
                            ? "#dc2626"
                            : factory.status === "WARNING"
                            ? "#d97706"
                            : "#16a34a",
                      }}
                    >
                      {factory.status}
                    </span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {/* ── Factory detail popup ────────────────────────────────────────── */}
        {originFactory && recoveryFactoryId && (
          <Popup
            key={`origin-${originFactory.id}`}
            position={[originFactory.latitude, originFactory.longitude]}
            closeButton={false}
            maxWidth={280}
            offset={[0, -16]}
            autoPan={false}
          >
            <FactoryPopup
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              factory={originFactory as any}
              onClose={() => {}}
              onViewFactory={() => onViewFactory(originFactory.id)}
              onFindAlternatives={() => onFindAlternatives(originFactory.id)}
              badge="ORDER ORIGIN"
            />
          </Popup>
        )}

        {recommendedFactory && recommendedFactoryId && (
          <Popup
            key={`recommended-${recommendedFactory.id}`}
            position={[recommendedFactory.latitude, recommendedFactory.longitude]}
            closeButton={false}
            maxWidth={280}
            offset={[0, -16]}
            autoPan={false}
          >
            <FactoryPopup
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              factory={recommendedFactory as any}
              onClose={() => {}}
              onViewFactory={() => onViewFactory(recommendedFactory.id)}
              onFindAlternatives={() => onFindAlternatives(recommendedFactory.id)}
              badge="AI RECOMMENDED"
            />
          </Popup>
        )}

        {selectedFactory && selectedFactory.id !== recoveryFactoryId && selectedFactory.id !== recommendedFactoryId && (
          <Popup
            key={selectedFactory.id}
            position={[selectedFactory.latitude, selectedFactory.longitude]}
            eventHandlers={{ remove: () => onSelectFactory(null) }}
            closeButton={false}
            maxWidth={280}
            offset={[0, -16]}
            autoPan={true}
          >
            <FactoryPopup
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              factory={selectedFactory as any}
              onClose={() => onSelectFactory(null)}
              onViewFactory={() => onViewFactory(selectedFactory.id)}
              onFindAlternatives={() => onFindAlternatives(selectedFactory.id)}
            />
          </Popup>
        )}

        {/* ── Animated Connection Line ────────────────────────────────────── */}
        {showConnection && originFactory && recommendedFactory && (
          <Polyline 
            positions={[
              [originFactory.latitude, originFactory.longitude],
              [recommendedFactory.latitude, recommendedFactory.longitude]
            ]}
            pathOptions={{ 
              color: '#8b5cf6', 
              weight: 3,
              dashArray: '8, 8',
              className: 'animate-pulse' 
            }}
          >
            <Tooltip permanent direction="center" className="bg-slate-900 text-purple-300 border-purple-500 font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded">
              AI Recommended Connection
            </Tooltip>
          </Polyline>
        )}

        {/* ── Cluster summary popup ───────────────────────────────────────── */}
        {clusterPopupInfo && (
          <Popup
            key={clusterPopupInfo.cluster.id}
            position={[clusterPopupInfo.position.lat, clusterPopupInfo.position.lng]}
            eventHandlers={{ remove: () => onSetClusterPopupInfo(null) }}
            closeButton={false}
            maxWidth={240}
            autoPan={true}
          >
            <ClusterPopup
              cluster={clusterPopupInfo.cluster}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              allFactories={filteredFactories as any[]}
              onClose={() => onSetClusterPopupInfo(null)}
            />
          </Popup>
        )}
      </MapContainer>

      {/* ── Custom zoom / reset controls (outside MapContainer, above map) ── */}
      <div className="absolute bottom-10 left-4 z-[1000] flex flex-col gap-1.5 pointer-events-auto">
        <ControlBtn onClick={() => mapRef.current?.zoomIn()} title="Zoom in">
          <ZoomIn className="h-3.5 w-3.5" />
        </ControlBtn>
        <ControlBtn onClick={() => mapRef.current?.zoomOut()} title="Zoom out">
          <ZoomOut className="h-3.5 w-3.5" />
        </ControlBtn>
        <ControlBtn onClick={handleReset} title="Reset to India overview">
          <RotateCcw className="h-3.5 w-3.5" />
        </ControlBtn>
      </div>
    </div>
  );
}
