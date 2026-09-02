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

// Port and factory coordinates
const TIRUPPUR: [number, number] = [11.1085, 77.3411];
const NHAVA_SHEVA: [number, number] = [18.9482, 72.9463];
const SUEZ: [number, number] = [29.9245, 32.5519];
const HAMBURG: [number, number] = [53.5488, 9.9872];

const FULL_ROUTE: [number, number][] = [
  TIRUPPUR,
  [14.5, 75.0], // Waypoint to port
  NHAVA_SHEVA,
  [14.0, 68.0], // Arabian Sea
  [12.0, 43.0], // Gulf of Aden
  SUEZ,
  [35.0, 15.0], // Mediterranean
  [45.0, -8.0], // Bay of Biscay
  HAMBURG
];

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
  const [currentPos, setCurrentPos] = useState<[number, number]>(FULL_ROUTE[0]);
  const [progress, setProgress] = useState(0);
  const reqRef = useRef<number>();

  // Ensure icons are only created on the client side
  const [icons, setIcons] = useState<{ shipIcon: L.Icon, trackingIcon: L.DivIcon } | null>(null);

  useEffect(() => {
    const iconPath = "https://unpkg.com/leaflet@1.9.4/dist/images/";
    const ship = new L.Icon({
      iconUrl: iconPath + "marker-icon.png",
      iconRetinaUrl: iconPath + "marker-icon-2x.png",
      shadowUrl: iconPath + "marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
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

    setIcons({ shipIcon: ship, trackingIcon: tracking });

    // Animate the marker
    const duration = 10000; 
    let startTime = performance.now();
    const segments = FULL_ROUTE.length - 1;

    const animate = (time: number) => {
      let elapsed = time - startTime;
      if (elapsed > duration) elapsed = duration; 
      
      const totalProgress = elapsed / duration; 
      setProgress(totalProgress);
      
      const segmentIndex = Math.min(Math.floor(totalProgress * segments), segments - 1);
      const segmentProgress = (totalProgress * segments) - segmentIndex;
      
      const startNode = FULL_ROUTE[segmentIndex];
      const endNode = FULL_ROUTE[segmentIndex + 1];
      
      if (startNode && endNode) {
        const lat = startNode[0] + (endNode[0] - startNode[0]) * segmentProgress;
        const lng = startNode[1] + (endNode[1] - startNode[1]) * segmentProgress;
        setCurrentPos([lat, lng]);
      }
      
      if (elapsed < duration) {
        reqRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          startTime = performance.now();
          reqRef.current = requestAnimationFrame(animate);
        }, 2000);
      }
    };
    
    reqRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  if (!icons) return <div className="h-[250px] w-full bg-slate-100 animate-pulse rounded-xl" />;

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
        <MapController route={FULL_ROUTE} />
        
        {/* Draw the full route path */}
        <Polyline 
          positions={FULL_ROUTE} 
          pathOptions={{ color: '#cbd5e1', weight: 3, dashArray: '5, 5' }} 
        />
        
        {/* Draw the traveled path */}
        <Polyline 
          positions={FULL_ROUTE.slice(0, Math.max(2, Math.floor(progress * (FULL_ROUTE.length - 1)) + 1))} 
          pathOptions={{ color: '#3b82f6', weight: 4 }} 
        />

        {/* Start and End markers */}
        <Marker position={TIRUPPUR} icon={icons.shipIcon} />
        <Marker position={HAMBURG} icon={icons.shipIcon} />
        
        {/* Animated current position marker */}
        <Marker position={currentPos} icon={icons.trackingIcon} />
      </MapContainer>
      
      {/* Overlay badges */}
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
        <div className="flex items-center gap-2">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span className="text-[10px] font-bold text-slate-700 tracking-wider uppercase">Live Tracking</span>
        </div>
      </div>
    </div>
  );
}
