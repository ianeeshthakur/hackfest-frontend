"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Factory, Package, Building2, Store, AlertTriangle, CheckCircle2, ChevronRight, ZoomIn, ZoomOut, Maximize } from "lucide-react";

// Default layout template
const BASE_NODES = [
  { id: "supplier-1", label: "Sri Cotton Suppliers", type: "supplier", material: "Raw Cotton", status: "ON TRACK", angle: -150, distance: 320 },
  { id: "supplier-2", label: "Kumar Spinning Mills", type: "manufacturer", material: "Raw Yarn", status: "ON TRACK", angle: -90, distance: 280 },
  { id: "supplier-3", label: "DuraThread Inc.", type: "supplier", material: "Synthetic Dyes", status: "ON TRACK", angle: -30, distance: 320 },
  { id: "customer-1", label: "Shree Dyeing Unit", type: "manufacturer", material: "Greige Fabric", status: "ON TRACK", angle: 30, distance: 320 },
  { id: "customer-2", label: "Vijay Garments", type: "manufacturer", material: "Finished Fabric", status: "ON TRACK", angle: 90, distance: 280 },
  { id: "logistics-1", label: "TransLogix", type: "logistics", material: "Finished Goods", status: "ON TRACK", angle: 150, distance: 320 },
];

const NodeIcon = ({ type }) => {
  switch (type) {
    case "supplier": return <Package className="w-6 h-6" />;
    case "manufacturer": return <Factory className="w-6 h-6" />;
    case "logistics": return <Truck className="w-6 h-6" />;
    case "customer": return <Store className="w-6 h-6" />;
    default: return <Building2 className="w-6 h-6" />;
  }
};

export function SupplyChainGraph({ activeDisruption, networkPhase = "NORMAL" }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const containerRef = useRef(null);
  
  // Pan and Zoom State
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isCalculated, setIsCalculated] = useState(false);

  // Dynamic Nodes based on disruption state
  const networkNodes = React.useMemo(() => {
    let nodes = JSON.parse(JSON.stringify(BASE_NODES));
    if (!activeDisruption || networkPhase === "NORMAL") return nodes;

    const isLogistics = activeDisruption.category === "SHIPMENT" || activeDisruption.type === "logisticsDelay";
    const isSupplier = activeDisruption.type === "rawMaterialDelay";
    const isFactory = activeDisruption.category === "FACTORY" && !isLogistics && !isSupplier;

    // Disruption & Search Phases
    if (networkPhase === "DISRUPTION" || networkPhase === "AI_SEARCH" || networkPhase === "REROUTING" || networkPhase === "RECOVERED") {
      if (isLogistics) {
        const n = nodes.find(x => x.id === "logistics-1");
        if (n) {
          n.status = "AT RISK";
          n.expectedDelay = `+${activeDisruption.delayHours}h`;
          n.impact = "High";
        }
      } else if (isSupplier) {
        const n = nodes.find(x => x.id === "supplier-2");
        if (n) {
          n.status = "AT RISK";
          n.expectedDelay = `+${activeDisruption.delayHours}h`;
          n.impact = "High";
        }
      } else if (isFactory) {
        nodes.forEach(n => {
          if (n.type === "manufacturer" && n.id.startsWith("customer")) {
            n.status = "AT RISK";
            n.expectedDelay = `+${activeDisruption.delayHours}h`;
            n.impact = "High";
          }
        });
      }
    }

    // Rerouting & Recovered Phases
    if (networkPhase === "REROUTING" || networkPhase === "RECOVERED") {
      if (isLogistics) {
        const n = nodes.find(x => x.id === "logistics-1");
        if (n) n.isOldRoute = true;
        
        nodes.push({
          id: "logistics-alt", label: "Alternate Carrier / Route", type: "logistics", material: "Finished Goods", status: networkPhase === "RECOVERED" ? "RECOVERED" : "ON TRACK", angle: 120, distance: 360, isAlternate: true, badge: "AI RECOMMENDED"
        });
      } else if (isSupplier) {
        const n = nodes.find(x => x.id === "supplier-2");
        if (n) n.isOldRoute = true;

        nodes.push({
          id: "supplier-alt", label: "Alternate Supplier", type: "supplier", material: "Raw Yarn", status: networkPhase === "RECOVERED" ? "RECOVERED" : "ON TRACK", angle: -120, distance: 360, isAlternate: true, badge: "AI RECOMMENDED"
        });
      } else if (isFactory) {
        nodes.push({
          id: "factory-alt", label: "Backup Capacity", type: "manufacturer", material: "Reallocated Line", status: networkPhase === "RECOVERED" ? "RECOVERED" : "ON TRACK", angle: 60, distance: 360, isAlternate: true, badge: "AI RECOMMENDED"
        });
        nodes.forEach(n => {
          if (n.type === "manufacturer" && n.id.startsWith("customer")) {
            n.status = networkPhase === "RECOVERED" ? "RECOVERED" : "ON TRACK";
            n.expectedDelay = activeDisruption.recovery ? `+${activeDisruption.recovery.delayHours}h` : "+0h";
            n.impact = "Low";
          }
        });
      }
    }

    return nodes;
  }, [activeDisruption, networkPhase]);

  const selectedNode = networkNodes.find(n => n.id === selectedNodeId);

  // Fit to View logic
  const fitToView = () => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // The graph bounding box: Max distance is 320. Plus node sizes (~100) and labels (~80).
    // Let's assume the graph needs about 900x900 pixels of internal space to look good.
    const GRAPH_SIZE = 900; 
    
    // Calculate scale to fit within container, adding a little padding (0.9 multiplier)
    const scaleX = width / GRAPH_SIZE;
    const scaleY = height / GRAPH_SIZE;
    const bestScale = Math.min(scaleX, scaleY) * 0.95;
    
    // Clamp the scale between 0.4 and 1.2
    const finalScale = Math.max(0.4, Math.min(bestScale, 1.2));
    
    setScale(finalScale);
    setPan({ x: 0, y: 0 }); // Center
    setIsCalculated(true);
  };

  useEffect(() => {
    fitToView();
    const handleResize = () => fitToView();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.15, 2));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.15, 0.3));

  // Determine label placement based on angle
  const getLabelTransform = (angle) => {
    // If it's on the right side (-90 to 90), label goes right or bottom.
    // Let's just place labels radially outward.
    const rad = angle * Math.PI / 180;
    const offset = 60; // offset from node center
    const x = Math.cos(rad) * offset;
    const y = Math.sin(rad) * offset;
    
    // Anchor text depending on side
    let align = "center";
    if (Math.cos(rad) > 0.5) align = "left";
    else if (Math.cos(rad) < -0.5) align = "right";

    return { x, y, align };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
      
      {/* Network Graph Area */}
      <div 
        className="col-span-2 relative h-[600px] bg-[#111826] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
        ref={containerRef}
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-[#0B0F17] p-1.5 rounded-lg border border-slate-800 shadow-xl">
          <button onClick={handleZoomIn} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={fitToView} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Fit to View">
            <Maximize className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* The Scalable/Pannable Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            className="relative pointer-events-auto"
            style={{ 
              width: 0, height: 0,
            }}
            animate={{ 
              scale: isCalculated ? scale : 0.8,
              x: pan.x,
              y: pan.y
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            onDrag={(e, info) => {
              setPan({ x: pan.x + info.delta.x, y: pan.y + info.delta.y });
            }}
          >
            {/* SVG for Connections */}
            <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0 }}>
              <defs>
                <linearGradient id="gradient-on-track" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="gradient-at-risk" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="gradient-alternate" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Central Radar Pulse for AI_SEARCH */}
              {networkPhase === "AI_SEARCH" && (
                <g>
                  <circle r="200" cx="0" cy="0" fill="none" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.2" />
                  <circle r="300" cx="0" cy="0" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.1" />
                  <motion.circle 
                    r="50" cx="0" cy="0" fill="none" stroke="#60a5fa" strokeWidth="3"
                    initial={{ r: 50, opacity: 1 }}
                    animate={{ r: 400, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.circle 
                    r="50" cx="0" cy="0" fill="none" stroke="#60a5fa" strokeWidth="2"
                    initial={{ r: 50, opacity: 1 }}
                    animate={{ r: 400, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                  />
                </g>
              )}

              {isCalculated && networkNodes.map((node, i) => {
                const isAtRisk = node.status === "AT RISK";
                const isRecovered = node.status === "RECOVERED";
                const isAlternate = node.isAlternate;
                const isOldRoute = node.isOldRoute;
                
                let color = "url(#gradient-on-track)";
                let strokeColor = "#10b981";
                if (isAtRisk) { color = "url(#gradient-at-risk)"; strokeColor = "#ef4444"; }
                if (isAlternate || isRecovered) { color = "url(#gradient-alternate)"; strokeColor = "#a855f7"; }
                
                const isSelected = selectedNodeId === node.id || selectedNodeId === null;
                const strokeDash = isOldRoute ? "4 8" : (isAlternate && networkPhase !== "RECOVERED" ? "6 6" : "0");

                const endX = Math.cos(node.angle * Math.PI / 180) * node.distance;
                const endY = Math.sin(node.angle * Math.PI / 180) * node.distance;

                return (
                  <g 
                    key={`line-${node.id}`} 
                    className={`transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-20'}`}
                  >
                    <motion.line
                      x1="0" y1="0"
                      x2={endX} y2={endY}
                      stroke={color}
                      strokeWidth={isOldRoute ? "2" : "3"}
                      strokeDasharray={strokeDash}
                      initial={isAlternate ? { pathLength: 0 } : { pathLength: 1 }}
                      animate={{ pathLength: 1, opacity: isOldRoute ? 0.3 : 1 }}
                      transition={{ duration: 1.5, delay: isAlternate ? 0 : (i * 0.15) }}
                    />
                    
                    {isSelected && !isOldRoute && (
                      <circle r="4" fill={strokeColor}>
                        <animateMotion
                          dur={isAtRisk ? "0.5s" : isAlternate ? "1s" : "2s"}
                          repeatCount="indefinite"
                          path={`M 0,0 L ${endX},${endY}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central Node (My Factory) */}
            {isCalculated && (() => {
              const isFactoryDisrupted = networkPhase !== "NORMAL" && activeDisruption?.category === "FACTORY" && activeDisruption?.type !== "rawMaterialDelay";
              return (
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={() => setSelectedNodeId(null)}
                className={`absolute w-36 h-36 -ml-18 -mt-18 rounded-full z-20 flex flex-col items-center justify-center border-4 transition-all duration-300 ${isFactoryDisrupted ? 'shadow-[0_0_50px_rgba(239,68,68,0.5)] bg-red-950 border-red-500' : 'shadow-[0_0_40px_rgba(59,130,246,0.2)] bg-[#0B0F17] border-blue-900'}
                  ${selectedNodeId === null 
                    ? (isFactoryDisrupted ? "bg-red-900 border-red-400 text-white scale-110 z-30" : "bg-blue-600 border-blue-400 text-white scale-110 z-30")
                    : (isFactoryDisrupted ? "bg-red-950 border-red-900 text-red-400 hover:border-red-700" : "bg-[#0B0F17] border-blue-900 text-blue-400 hover:border-blue-700")}
                `}
                style={{
                  left: 0, top: 0,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {isFactoryDisrupted && networkPhase === "DISRUPTION" && (
                  <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
                )}
                <div className="flex flex-col items-center justify-center gap-1 z-10 relative">
                  <Factory className="w-8 h-8 mb-1" />
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedNodeId === null ? 'text-white/70' : 'text-current/70'}`}>F-013</span>
                  <span className="text-sm font-bold leading-tight">Suresh Textiles</span>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 ${selectedNodeId === null ? 'bg-black/30' : 'bg-current/10'}`}>My Factory</span>
                </div>
              </motion.button>
              );
            })()}

            {/* Outer Nodes */}
            {isCalculated && networkNodes.map((node, i) => {
              const isSelected = selectedNodeId === node.id;
              const isFaded = (selectedNodeId !== null && !isSelected) || node.isOldRoute;
              const isAtRisk = node.status === "AT RISK";
              const isRecovered = node.status === "RECOVERED";
              const isAlternate = node.isAlternate;

              const x = Math.cos(node.angle * Math.PI / 180) * node.distance;
              const y = Math.sin(node.angle * Math.PI / 180) * node.distance;
              
              const labelPos = getLabelTransform(node.angle);

              return (
                <motion.div
                  key={node.id}
                  className={`absolute z-10 transition-opacity duration-300 ${isFaded ? 'opacity-30' : 'opacity-100'}`}
                  style={{ left: x, top: y }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: isFaded ? 0.3 : 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.8 + i * 0.1 }}
                >
                  <button 
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`absolute w-24 h-24 -ml-12 -mt-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 shadow-xl group z-20
                      ${isSelected ? (isAtRisk ? 'bg-red-500 border-red-300 text-red-950 scale-125 z-30 shadow-red-900/50' : (isAlternate || isRecovered) ? 'bg-purple-500 border-purple-300 text-purple-950 scale-125 z-30 shadow-purple-900/50' : 'bg-emerald-500 border-emerald-300 text-emerald-950 scale-125 z-30 shadow-emerald-900/50') 
                      : (isAtRisk ? 'bg-[#111826] border-red-500 text-red-500 hover:border-red-400 z-10' : (isAlternate || isRecovered) ? 'bg-[#111826] border-purple-500 text-purple-500 hover:border-purple-400 z-10' : 'bg-[#111826] border-slate-700 text-slate-400 hover:border-slate-400 z-10')}
                    `}
                  >
                    {isAtRisk && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 animate-ping border-2 border-[#111826]"></span>
                    )}
                    {isAlternate && !isSelected && (
                      <span className="absolute -inset-2 rounded-full border border-purple-500 animate-ping opacity-50"></span>
                    )}
                    <NodeIcon type={node.type} />
                  </button>
                  
                  {node.badge && (
                    <div className={`absolute -top-14 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded shadow-lg text-[9px] font-bold tracking-widest whitespace-nowrap
                      ${isSelected ? 'bg-purple-900 text-white' : 'bg-purple-900/50 text-purple-200 border border-purple-800/50'}
                    `}>
                      {node.badge}
                    </div>
                  )}
                  
                  {/* Radially positioned label */}
                  <div 
                    className="absolute pointer-events-none w-40 flex flex-col"
                    style={{
                      left: labelPos.x,
                      top: labelPos.y,
                      transform: 'translate(-50%, -50%)',
                      alignItems: labelPos.align === 'left' ? 'flex-start' : labelPos.align === 'right' ? 'flex-end' : 'center',
                      textAlign: labelPos.align
                    }}
                  >
                    <div className={`px-3 py-1.5 rounded-lg shadow-lg border backdrop-blur-md ${isSelected ? 'bg-slate-800/90 border-slate-600' : 'bg-[#0B0F17]/80 border-slate-800/80'}`}>
                      <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>{node.label}</p>
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest mt-0.5 font-semibold">{node.material}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Details Panel */}
      <div className="col-span-1 bg-[#111826] rounded-2xl border border-slate-800 shadow-2xl p-6 flex flex-col">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">Connection Details</h2>
        
        <AnimatePresence mode="wait">
          {selectedNodeId === null ? (
            <motion.div
              key="factory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-900/30 text-blue-500 rounded-xl border border-blue-900/50">
                  <Factory className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight">Suresh Textiles</h3>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Central Hub</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Direct Connections</p>
                  <p className="text-2xl font-bold text-slate-200">{networkNodes.length}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-900/30">
                    <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider mb-1">On Track</p>
                    <p className="text-xl font-bold text-emerald-400">{networkNodes.filter(n => n.status === "ON TRACK" || n.status === "RECOVERED").length}</p>
                  </div>
                  <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/30">
                    <p className="text-[10px] text-red-500/80 uppercase tracking-wider mb-1">At Risk</p>
                    <p className="text-xl font-bold text-red-400">{networkNodes.filter(n => n.status === "AT RISK").length}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-tight mb-1">{selectedNode.label}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{selectedNode.type}</p>
                </div>
                <div className={`p-2 rounded-lg ${selectedNode.status === "AT RISK" ? "bg-red-950/30 text-red-500" : (selectedNode.status === "RECOVERED" || selectedNode.isAlternate) ? "bg-purple-950/30 text-purple-400" : "bg-emerald-950/30 text-emerald-500"}`}>
                  <NodeIcon type={selectedNode.type} />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Relationship Status</p>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    selectedNode.status === "AT RISK" 
                      ? "bg-red-950/20 border-red-900/30 text-red-400" 
                      : (selectedNode.status === "RECOVERED" || selectedNode.isAlternate)
                      ? "bg-purple-950/20 border-purple-900/30 text-purple-400"
                      : "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                  }`}>
                    {selectedNode.status === "AT RISK" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-xs font-bold tracking-wide uppercase">{selectedNode.status}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Material Flow</p>
                    <p className="text-sm font-semibold text-slate-200">{selectedNode.material}</p>
                  </div>
                  {selectedNode.status === "AT RISK" && (
                    <>
                      <div className="h-px w-full bg-slate-800"></div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-red-500/80 uppercase tracking-wider mb-0.5">Expected Delay</p>
                          <p className="text-sm font-bold text-red-400">{selectedNode.expectedDelay}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-red-500/80 uppercase tracking-wider mb-0.5">Impact</p>
                          <p className="text-sm font-bold text-red-400 uppercase">{selectedNode.impact}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs tracking-wider uppercase font-semibold rounded-lg transition-colors border border-slate-700">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
