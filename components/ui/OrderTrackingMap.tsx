"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDisruption } from "@/lib/disruptionContext";

// Port and factory coordinates
const TIRUPPUR: [number, number] = [11.1085, 77.3411];
const NHAVA_SHEVA: [number, number] = [18.9482, 72.9463];
const MUNDRA: [number, number] = [22.7380, 69.7042];
const SUEZ: [number, number] = [29.9245, 32.5519];
const HAMBURG: [number, number] = [53.5488, 9.9872];

const ORIGINAL_ROUTE: [number, number][] = [
  TIRUPPUR,
  [14.5, 75.0], // Waypoint to port
  NHAVA_SHEVA, // index 2 (disruption point)
  [14.0, 68.0], // Arabian Sea
  [12.0, 43.0], // Gulf of Aden
  SUEZ,
  [35.0, 15.0], // Mediterranean
  [45.0, -8.0], // Bay of Biscay
  HAMBURG
];

const RECOVERY_ROUTE: [number, number][] = [
  TIRUPPUR,
  [16.0, 73.0], // Waypoint to alternate port
  MUNDRA, // index 2
  [18.0, 64.0], // Arabian Sea
  [14.0, 52.0], // Entering Gulf
  [12.0, 43.0], // Gulf of Aden
  SUEZ,
  [35.0, 15.0], // Mediterranean
  [45.0, -8.0], // Bay of Biscay
  HAMBURG
];

const DISRUPTION_INDEX = 2;
const TOTAL_SEGMENTS = ORIGINAL_ROUTE.length - 1;
const DISRUPTION_PROGRESS = DISRUPTION_INDEX / TOTAL_SEGMENTS; // 0.25

function MapController({ route }: { route: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [20, 20], animate: true });
    }
  }, [map, route]);
  return null;
}

export default function OrderTrackingMap() {
  const [currentPos, setCurrentPos] = useState<[number, number]>(ORIGINAL_ROUTE[0]);
  const [progress, setProgress] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  
  const reqRef = useRef<number>();
  const progressRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  
  // Use Global Disruption Context
  const { activeDisruption, simulationState } = useDisruption();

  // State calculations
  const isDisrupted = !!activeDisruption && simulationState !== "RESOLVED" && simulationState !== "IDLE";
  const isRecovered = simulationState === "RESOLVED";
  
  const activeRoute = isRecovered ? RECOVERY_ROUTE : ORIGINAL_ROUTE;

  const isDisruptedRef = useRef(isDisrupted);
  const activeRouteRef = useRef(activeRoute);

  useEffect(() => {
    isDisruptedRef.current = isDisrupted;
    activeRouteRef.current = activeRoute;
  }, [isDisrupted, activeRoute]);

  const [icons, setIcons] = useState<{ 
    shipIcon: L.Icon, 
    trackingIcon: L.DivIcon,
    disruptionIcon: L.DivIcon 
  } | null>(null);

  useEffect(() => {
    const iconPath = "https://unpkg.com/leaflet@1.9.4/dist/images/";
    const ship = new L.Icon({
      iconUrl: iconPath + "marker-icon.png",
      iconRetinaUrl: iconPath + "marker-icon-2x.png",
      shadowUrl: iconPath + "marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const tracking = new L.DivIcon({
      className: "bg-transparent",
      html: `
        <div class="relative flex h-4 w-4 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border border-white shadow"></span>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const disrupted = new L.DivIcon({
      className: "bg-transparent",
      html: `
        <div class="relative flex h-5 w-5 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border-2 border-white shadow"></span>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    setIcons({ shipIcon: ship, trackingIcon: tracking, disruptionIcon: disrupted });

    // Animate the marker (Total duration for full route = 20 seconds)
    const durationMs = 20000; 
    const speedPerMs = 1 / durationMs;
    lastTimeRef.current = performance.now();

    const animate = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      let p = progressRef.current;
      
      if (isDisruptedRef.current && p >= DISRUPTION_PROGRESS) {
        // Halt at disruption point exactly
        p = DISRUPTION_PROGRESS;
        setIsFrozen(true);
      } else {
        setIsFrozen(false);
        p += speedPerMs * deltaTime;
        if (p > 1) {
          p = 1; // STOP at destination
        }
      }
      
      progressRef.current = p;
      setProgress(p);
      
      // Calculate position
      const route = activeRouteRef.current;
      const segments = route.length - 1;
      const segmentIndex = Math.min(Math.floor(p * segments), segments - 1);
      const segmentProgress = (p * segments) - segmentIndex;
      
      const startNode = route[segmentIndex];
      const endNode = route[segmentIndex + 1];
      
      if (startNode && endNode) {
        const lat = startNode[0] + (endNode[0] - startNode[0]) * segmentProgress;
        const lng = startNode[1] + (endNode[1] - startNode[1]) * segmentProgress;
        setCurrentPos([lat, lng]);
      }
      
      if (p < 1) {
        reqRef.current = requestAnimationFrame(animate);
      }
    };
    
    reqRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  if (!icons) return <div className="h-[250px] w-full bg-slate-100 animate-pulse rounded-xl" />;

  const trackingOverlayClass = isFrozen 
    ? "bg-red-50 text-red-700 border-red-200" 
    : isRecovered 
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-white/90 text-slate-700 border-slate-200";

  return (
    <div className="w-full h-[250px] rounded-xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <MapContainer 
        center={[20, 40]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapController route={activeRoute} />
        
        {/* Draw the full route path */}
        <Polyline 
          positions={activeRoute} 
          pathOptions={{ color: '#cbd5e1', weight: 3, dashArray: '5, 5' }} 
        />
        
        {/* Draw the traveled path */}
        <Polyline 
          positions={activeRoute.slice(0, Math.max(2, Math.floor(progress * (activeRoute.length - 1)) + 1))} 
          pathOptions={{ color: isFrozen ? '#ef4444' : '#3b82f6', weight: 4 }} 
        />

        {/* Start and End markers */}
        <Marker position={TIRUPPUR} icon={icons.shipIcon} />
        <Marker position={HAMBURG} icon={icons.shipIcon} />
        
        {/* Animated current position marker */}
        <Marker position={currentPos} icon={isFrozen ? icons.disruptionIcon : icons.trackingIcon} />
      </MapContainer>
      
      {/* Overlay badges */}
      <div className={`absolute top-3 right-3 z-[400] backdrop-blur-sm border px-3 py-1.5 rounded-full shadow-sm pointer-events-none ${trackingOverlayClass}`}>
        <div className="flex items-center gap-2">
           <span className="relative flex h-2 w-2">
             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFrozen ? "bg-red-400" : isRecovered ? "bg-emerald-400" : "bg-blue-400"}`}></span>
             <span className={`relative inline-flex rounded-full h-2 w-2 ${isFrozen ? "bg-red-500" : isRecovered ? "bg-emerald-500" : "bg-blue-500"}`}></span>
           </span>
           <span className="text-[10px] font-bold tracking-wider uppercase">
             {isFrozen ? "Shipment On Hold" : isRecovered ? "Rerouting..." : progress === 1 ? "Delivered" : "Live Tracking"}
           </span>
        </div>
      </div>
    </div>
  );
}
