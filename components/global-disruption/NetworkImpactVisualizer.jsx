import React from "react";
import { Factory, Warehouse, Ship, Building2, Package, MapPin } from "lucide-react";

export function NetworkImpactVisualizer({ activeEvent }) {
  if (!activeEvent) return null;
  const type = activeEvent.type;

  const nodes = [
    { id: "supplier", label: "Raw Material", icon: Package, x: 10, y: 50 },
    { id: "dyeing", label: "Dyeing Unit", icon: Building2, x: 25, y: 50 },
    { id: "factory", label: "Assembly (Tiruppur)", icon: Factory, x: 45, y: 50 },
    { id: "warehouse", label: "Logistics Hub", icon: Warehouse, x: 65, y: 50 },
    { id: "port", label: "Port (Nhava Sheva)", icon: Ship, x: 80, y: 50 },
    { id: "buyer", label: "Buyer (EU)", icon: MapPin, x: 95, y: 50 },
  ];

  const getStatus = (nodeId) => {
    switch (type) {
      case "powerCut":
      case "machineBreakdown":
      case "workerShortage":
        if (nodeId === "factory") return "disrupted";
        if (nodeId === "warehouse" || nodeId === "port" || nodeId === "buyer") return "affected";
        return "normal";
        
      case "rawMaterialDelay":
        if (nodeId === "supplier") return "disrupted";
        if (nodeId !== "supplier") return "affected"; // everything downstream
        return "normal";

      case "logisticsDelay":
        if (nodeId === "port") return "disrupted";
        if (nodeId === "buyer") return "affected";
        return "normal";

      default:
        return "normal";
    }
  };

  const getPathStatus = (from, to) => {
    const fromStatus = getStatus(from);
    if (fromStatus === "disrupted" || fromStatus === "affected") {
      return "disrupted-path";
    }
    return "normal-path";
  };

  return (
    <div className="w-full h-full min-h-[250px] relative mt-8 font-body">
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="disrupted-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {nodes.map((node, i) => {
          if (i === nodes.length - 1) return null;
          const next = nodes[i + 1];
          const pathStatus = getPathStatus(node.id, next.id);
          return (
            <line
              key={`line-${i}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke={pathStatus === "normal-path" ? "#cbd5e1" : "url(#disrupted-line)"}
              strokeWidth="3"
              strokeDasharray={pathStatus === "disrupted-path" ? "6, 6" : "none"}
              className={pathStatus === "disrupted-path" ? "animate-pulse" : ""}
            />
          );
        })}
        {/* Recovery alternate path (mock) */}
        {type === "logisticsDelay" && (
           <path 
             d={`M 65% 50% Q 80% 20% 95% 50%`}
             fill="none"
             stroke="#10b981"
             strokeWidth="2"
             strokeDasharray="4, 4"
             className="animate-[dash_2s_linear_infinite]"
           />
        )}
      </svg>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>

      {/* Nodes */}
      {nodes.map(node => {
        const status = getStatus(node.id);
        const Icon = node.icon;
        
        let bgClass = "bg-white border-slate-200 text-slate-500";
        let glowClass = "";
        
        if (status === "disrupted") {
          bgClass = "bg-red-500 border-red-600 text-white";
          glowClass = "shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse";
        } else if (status === "affected") {
          bgClass = "bg-red-50 border-red-300 text-red-500";
        }

        return (
          <div 
            key={node.id} 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 ${bgClass} ${glowClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className={`mt-3 text-[11px] font-bold text-center uppercase tracking-wider ${status === 'disrupted' ? 'text-red-600' : 'text-slate-500'}`}>
              {node.label}
            </div>
            {status === "disrupted" && (
              <div className="absolute -top-3 -right-3">
                 <span className="flex h-4 w-4 relative">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                 </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
