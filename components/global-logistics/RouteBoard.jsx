import React from "react";
import { RouteCheckpoint } from "./RouteCheckpoint";
import { AnimatedShip, RouteProgress } from "./AnimatedShip";
import { DisruptionAlert } from "./DisruptionAlert";
import { ORIGINAL_ROUTE, ALTERNATE_ROUTE, ORDER_DETAILS } from "@/lib/globalLogisticsData";

export function RouteBoard({ simState, progressPercent, onCheckpointComplete, currentNodeId }) {
  const isRerouted = ["REROUTING", "MOVING_TO_MUNDRA", "ARRIVED_MUNDRA", "MOVING_TO_ARABIAN_SEA", "ARRIVED_ARABIAN_SEA", "MOVING_TO_SUEZ", "ARRIVED_SUEZ", "MOVING_TO_HAMBURG", "DELIVERED"].includes(simState);
  
  const activeRoute = isRerouted ? ALTERNATE_ROUTE : ORIGINAL_ROUTE;

  const getNodeStatus = (nodeIndex, nodeId) => {
    // If it's the disrupted node (Nhava Sheva) and we are currently disrupted
    if (nodeId === "nhava_sheva" && ["ARRIVED_NHAVA", "DISRUPTION_DETECTED", "ANALYZING", "ALTERNATIVE_FOUND"].includes(simState)) {
      return "DISRUPTED";
    }
    
    // For normal completion logic based on progress:
    // 0: 0%, 1: 25%, 2: 50%, 3: 75%, 4: 100%
    const nodeProgress = nodeIndex * 25;
    
    if (progressPercent < nodeProgress) return "UPCOMING";
    
    // If we exactly reached this node's progress
    if (progressPercent === nodeProgress) {
      if (simState === "IDLE" && nodeIndex === 0) return "CURRENT"; // Start node
      if (simState.startsWith("ARRIVED_")) {
        // Find which node we just arrived at
        const arrivedMap = {
          "ARRIVED_MUNDRA": "mundra",
          "ARRIVED_ARABIAN_SEA": "arabian_sea",
          "ARRIVED_SUEZ": "suez_canal",
          "DELIVERED": "hamburg"
        };
        if (arrivedMap[simState] === nodeId) return "COMPLETING";
      }
      if (simState === "DELIVERED") return "COMPLETED";
      return "CURRENT";
    }
    
    if (progressPercent > nodeProgress) return "COMPLETED";
    
    return "UPCOMING";
  };

  const currentActiveNode = activeRoute.find(n => n.id === currentNodeId) || activeRoute[0];

  return (
    <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col p-8 relative">
      <div className="flex justify-between items-start mb-8 relative z-20">
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{ORDER_DETAILS.id} Route Board</h2>
          <div className="text-2xl font-semibold text-white tracking-tight">A deliberate path to {ORDER_DETAILS.destination}</div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</div>
          <div className={`px-3 py-1 rounded border text-xs font-bold tracking-wider uppercase ${
            simState === "IDLE" ? "bg-slate-800 border-slate-700 text-slate-300" :
            simState === "DELIVERED" ? "bg-teal-500/20 border-teal-500/50 text-teal-400" :
            ["ARRIVED_NHAVA", "DISRUPTION_DETECTED", "ANALYZING", "ALTERNATIVE_FOUND"].includes(simState) ? "bg-red-500/20 border-red-500/50 text-red-400" :
            "bg-amber-500/20 border-amber-500/50 text-amber-400"
          }`}>
            {simState === "IDLE" ? "SCHEDULED" :
             simState === "DELIVERED" ? "DELIVERED" :
             ["ARRIVED_NHAVA", "DISRUPTION_DETECTED", "ANALYZING", "ALTERNATIVE_FOUND"].includes(simState) ? "PORT HOLD" :
             "IN TRANSIT"}
          </div>
        </div>
      </div>

      <DisruptionAlert simState={simState} />

      <div className="mt-8 mb-16 relative">
        <div className="text-[10px] text-teal-500 font-bold uppercase tracking-widest mb-4">Live route simulation</div>
        
        {/* Tracks Area */}
        <div className="relative w-full mt-12 mb-16 h-32">
          
          {/* ORIGINAL ROUTE (Dimmed if rerouted) */}
          {isRerouted && (
            <div className="absolute top-0 w-full h-10 opacity-40 translate-y-2 pointer-events-none transition-all duration-1000">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-800 rounded-full" />
              <div className="absolute inset-0 flex justify-between">
                {ORIGINAL_ROUTE.map((node, i) => (
                  <RouteCheckpoint 
                    key={`orig-${node.id}`} 
                    node={node} 
                    status={node.id === "nhava_sheva" ? "DISRUPTED" : (i === 0 ? "COMPLETED" : "UPCOMING")} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* ACTIVE ROUTE (Main) */}
          <div className={`absolute w-full h-10 transition-all duration-1000 ${isRerouted ? "top-16" : "top-1/2 -translate-y-1/2"}`}>
            {/* Base track */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-800 rounded-full" />
            
            <RouteProgress progressPercent={progressPercent} />
            
            <div className="absolute inset-0 flex justify-between">
              {activeRoute.map((node, i) => (
                <RouteCheckpoint 
                  key={node.id} 
                  node={node} 
                  status={getNodeStatus(i, node.id)} 
                  onAnimationComplete={onCheckpointComplete}
                />
              ))}
            </div>

            <AnimatedShip progressPercent={progressPercent} />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800/50 flex justify-between items-center relative z-20">
        <div className="text-sm font-medium text-slate-400">
          Current node &middot; <span className="text-white font-semibold">{currentActiveNode.name}</span>
        </div>
        
        <div className="flex items-center gap-8 text-sm">
          <div>
            <div className="text-white font-semibold">{Math.round((progressPercent / 100) * 8420).toLocaleString()} km</div>
            <div className="text-slate-500 text-xs">covered</div>
          </div>
          <div>
            <div className="text-white font-semibold">{Math.round(((100 - progressPercent) / 100) * 8420).toLocaleString()} km</div>
            <div className="text-slate-500 text-xs">remaining</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 font-semibold">8,420 km</div>
            <div className="text-slate-500 text-xs">total route</div>
          </div>
        </div>
      </div>
      
      {/* Ship Progress Overlay */}
      <div className="absolute top-8 right-1/2 translate-x-1/2 text-center pointer-events-none opacity-10">
        <div className="text-6xl font-black text-white">{Math.round(progressPercent)}%</div>
      </div>
    </div>
  );
}
