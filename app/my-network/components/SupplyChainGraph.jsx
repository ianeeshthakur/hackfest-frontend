"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Factory, Package, Building2, Store, AlertTriangle, CheckCircle2, ChevronRight, ZoomIn, ZoomOut, Maximize } from "lucide-react";

// Adjust distances and angles for a cleaner radial layout.
// Spread them out to avoid overlap.
const NETWORK_NODES = [
  { id: "supplier-1", label: "Sri Cotton Suppliers", type: "supplier", material: "Raw Cotton", status: "ON TRACK", angle: -150, distance: 320 },
  { id: "supplier-2", label: "Kumar Spinning Mills", type: "manufacturer", material: "Raw Yarn", status: "ON TRACK", angle: -90, distance: 280 },
  { id: "supplier-3", label: "DuraThread Inc.", type: "supplier", material: "Synthetic Dyes", status: "AT RISK", angle: -30, distance: 320, expectedDelay: "+4h", impact: "Low" },
  { id: "customer-1", label: "Shree Dyeing Unit", type: "manufacturer", material: "Greige Fabric", status: "AT RISK", angle: 30, distance: 320, expectedDelay: "+9h", impact: "High" },
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

export function SupplyChainGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const containerRef = useRef(null);
  
  // Pan and Zoom State
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isCalculated, setIsCalculated] = useState(false);

  const selectedNode = NETWORK_NODES.find(n => n.id === selectedNodeId);

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
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {isCalculated && NETWORK_NODES.map((node, i) => {
                const isAtRisk = node.status === "AT RISK";
                const color = isAtRisk ? "url(#gradient-at-risk)" : "url(#gradient-on-track)";
                const strokeColor = isAtRisk ? "#f59e0b" : "#10b981";
                const isSelected = selectedNodeId === node.id || selectedNodeId === null;

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
                      strokeWidth="3"
                      strokeDasharray="6 6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: i * 0.15 }}
                    />
                    
                    {isSelected && (
                      <circle r="4" fill={strokeColor}>
                        <animateMotion
                          dur={isAtRisk ? "3s" : "2s"}
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
            {isCalculated && (
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={() => setSelectedNodeId(null)}
                className={`absolute w-36 h-36 -ml-18 -mt-18 rounded-full z-20 flex flex-col items-center justify-center border-4 transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.2)]
                  ${selectedNodeId === null 
                    ? "bg-blue-600 border-blue-400 text-white scale-110 z-30" 
                    : "bg-[#0B0F17] border-blue-900 text-blue-400 hover:border-blue-700"}
                `}
                style={{
                  left: 0, top: 0,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <Factory className="w-8 h-8 mb-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">F-013</span>
                  <span className="text-sm font-bold leading-tight">Suresh Textiles</span>
                  <span className="text-[9px] uppercase tracking-widest bg-blue-900/50 px-2 py-0.5 rounded-full mt-1">My Factory</span>
                </div>
              </motion.button>
            )}

            {/* Outer Nodes */}
            {isCalculated && NETWORK_NODES.map((node, i) => {
              const isSelected = selectedNodeId === node.id;
              const isFaded = selectedNodeId !== null && !isSelected;
              const isAtRisk = node.status === "AT RISK";

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
                    className={`absolute w-24 h-24 -ml-12 -mt-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 shadow-xl group
                      ${isSelected ? (isAtRisk ? 'bg-amber-500 border-amber-300 text-amber-950 scale-125 z-30 shadow-amber-900/50' : 'bg-emerald-500 border-emerald-300 text-emerald-950 scale-125 z-30 shadow-emerald-900/50') 
                      : (isAtRisk ? 'bg-[#111826] border-amber-500/50 text-amber-500 hover:border-amber-400 z-10' : 'bg-[#111826] border-slate-700 text-slate-400 hover:border-slate-400 z-10')}
                    `}
                  >
                    {isAtRisk && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-pulse border-2 border-[#111826]"></span>
                    )}
                    <NodeIcon type={node.type} />
                  </button>
                  
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
                  <p className="text-2xl font-bold text-slate-200">{NETWORK_NODES.length}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-900/30">
                    <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider mb-1">On Track</p>
                    <p className="text-xl font-bold text-emerald-400">{NETWORK_NODES.filter(n => n.status === "ON TRACK").length}</p>
                  </div>
                  <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-900/30">
                    <p className="text-[10px] text-amber-500/80 uppercase tracking-wider mb-1">At Risk</p>
                    <p className="text-xl font-bold text-amber-400">{NETWORK_NODES.filter(n => n.status === "AT RISK").length}</p>
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
                <div className={`p-2 rounded-lg ${selectedNode.status === "AT RISK" ? "bg-amber-950/30 text-amber-500" : "bg-emerald-950/30 text-emerald-500"}`}>
                  <NodeIcon type={selectedNode.type} />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Relationship Status</p>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    selectedNode.status === "AT RISK" 
                      ? "bg-amber-950/20 border-amber-900/30 text-amber-400" 
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
                          <p className="text-[10px] text-amber-500/80 uppercase tracking-wider mb-0.5">Expected Delay</p>
                          <p className="text-sm font-bold text-amber-400">{selectedNode.expectedDelay}</p>
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
