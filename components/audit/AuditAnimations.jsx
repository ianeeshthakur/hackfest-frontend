"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, Cpu, Factory, Search, Zap, CheckCircle2, Route, Truck, Package, Bell, ShieldCheck, Box, Workflow, Network, FileDown, GitCommit } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 1. DISRUPTION DETECTED
// ─────────────────────────────────────────────────────────────────────────────
export function DisruptionAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      
      <div className="flex items-center gap-6 z-10">
        {/* Machine Node */}
        <div className="relative">
          <motion.div 
            initial={{ borderColor: "#4ade80" }}
            animate={{ borderColor: "#ef4444" }}
            transition={{ delay: 1, duration: 0.2 }}
            className="w-12 h-12 rounded-lg border-2 bg-slate-800 flex items-center justify-center relative"
          >
            <Factory className="w-6 h-6 text-slate-400" />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ delay: 1.2, duration: 1, repeat: 2 }}
              className="absolute inset-0 rounded-lg border border-red-500"
            />
          </motion.div>
        </div>

        {/* Signal Lines */}
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div 
                initial={{ width: 0, opacity: 1, backgroundColor: "#4ade80" }}
                animate={{ 
                  width: 40,
                  backgroundColor: i === 1 ? ["#4ade80", "#ef4444"] : "#4ade80",
                  opacity: i === 1 ? [1, 0] : 1
                }}
                transition={{ 
                  width: { duration: 0.5 },
                  backgroundColor: { delay: 1, duration: 0.1 },
                  opacity: { delay: 1.1, duration: 0.2, fillMode: "forwards" }
                }}
                className="h-[2px] rounded-full"
              />
              <motion.div
                initial={{ opacity: 1, color: "#4ade80" }}
                animate={{ 
                  opacity: i === 1 ? 0.3 : 1, 
                  color: i === 1 ? "#ef4444" : "#4ade80" 
                }}
                transition={{ delay: 1 }}
              >
                <Activity className="w-3 h-3" />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Output Node */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center"
        >
          <div className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-[9px] font-bold text-red-400 tracking-widest flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            0 OUTPUT
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INVESTIGATION COMPLETED
// ─────────────────────────────────────────────────────────────────────────────
export function InvestigationAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
      <div className="flex items-center gap-8 z-10">
        
        {/* Scanner */}
        <div className="relative w-12 h-16 border border-slate-700 bg-slate-800/50 rounded overflow-hidden flex flex-col justify-evenly px-2">
          <div className="h-1 bg-slate-600 rounded-full w-full" />
          <div className="h-1 bg-slate-600 rounded-full w-3/4" />
          <div className="h-1 bg-slate-600 rounded-full w-full" />
          
          {/* Scanning beam */}
          <motion.div 
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 1.2, ease: "linear" }}
            className="absolute left-0 right-0 h-4 bg-gradient-to-b from-transparent to-indigo-500/40 border-b border-indigo-400"
          />
        </div>

        {/* AI Processing */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
          className="relative"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
            <Search className="w-5 h-5 text-indigo-400" />
          </div>
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute -inset-1 border border-dashed border-indigo-500/30 rounded-full"
          />
        </motion.div>

        {/* Root Cause found */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center"
        >
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mb-1 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Root Cause</span>
        </motion.div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECOVERY RECOMMENDATION GENERATED
// ─────────────────────────────────────────────────────────────────────────────
export function RecoveryAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
      <div className="flex items-center gap-6 z-10 w-full max-w-sm justify-center">
        
        {/* Source Problem */}
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative shrink-0">
          <Zap className="w-5 h-5 text-amber-500" />
        </div>

        {/* AI branching */}
        <div className="flex flex-col gap-2 relative">
          {/* SVG connecting lines */}
          <svg className="absolute -left-6 top-0 w-6 h-full" style={{ zIndex: -1 }}>
             <path d="M 0 50 C 10 50, 15 15, 24 15" stroke="#475569" fill="none" strokeWidth="1" />
             <path d="M 0 50 L 24 50" stroke="#475569" fill="none" strokeWidth="1" />
             <path d="M 0 50 C 10 50, 15 85, 24 85" stroke="#475569" fill="none" strokeWidth="1" />
          </svg>

          {/* Option A (Recommended) */}
          <motion.div 
             initial={{ opacity: 0, x: -10, borderColor: "#334155" }}
             animate={{ opacity: 1, x: 0, borderColor: ["#334155", "#4ade80"] }}
             transition={{ opacity: { delay: 0.5 }, x: { delay: 0.5 }, borderColor: { delay: 1.5 } }}
             className="px-3 py-1.5 bg-slate-800/80 rounded border flex items-center gap-2"
          >
             <span className="text-[10px] text-slate-300 font-medium">Option A</span>
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}>
               <CheckCircle2 className="w-3 h-3 text-emerald-400" />
             </motion.div>
          </motion.div>

          {/* Option B */}
          <motion.div 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.7 }}
             className="px-3 py-1.5 bg-slate-800/80 rounded border border-slate-700 flex items-center opacity-50"
          >
             <span className="text-[10px] text-slate-400 font-medium">Option B</span>
          </motion.div>

          {/* Option C */}
          <motion.div 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.9 }}
             className="px-3 py-1.5 bg-slate-800/80 rounded border border-slate-700 flex items-center opacity-50"
          >
             <span className="text-[10px] text-slate-400 font-medium">Option C</span>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. BUYER DECISION REQUESTED
// ─────────────────────────────────────────────────────────────────────────────
export function DecisionPendingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
      <div className="flex items-center gap-12 z-10">
        
        {/* Recommendation Card moving to human */}
        <motion.div 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded flex items-center gap-2"
        >
          <FileDown className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] text-indigo-300 font-medium tracking-wide">Rec. Action</span>
        </motion.div>

        {/* Human / Buttons */}
        <div className="flex flex-col items-center gap-3">
          <motion.div 
             initial={{ opacity: 0.5 }}
             animate={{ opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="text-[9px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
          >
            Awaiting Human
          </motion.div>
          <div className="flex gap-2">
            <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
               className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-[9px] text-slate-300 font-bold"
            >
              WAIT
            </motion.div>
            <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}
               className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] text-emerald-400 font-bold"
            >
              APPROVE
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REROUTE APPROVED / 8. SHIPMENT REROUTED
// ─────────────────────────────────────────────────────────────────────────────
export function RerouteAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
      <div className="w-full max-w-[200px] h-20 relative z-10">
        
        {/* Source */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-700 border border-slate-600 z-10" />
        
        {/* Original Destination (Failed) */}
        <div className="absolute right-0 top-2 w-4 h-4 rounded-full bg-red-500/20 border border-red-500 z-10 flex items-center justify-center">
          <span className="text-[8px] text-red-500 font-bold">X</span>
        </div>
        
        {/* New Destination (Approved) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-0 bottom-2 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 z-10"
        />

        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* Original line */}
          <path d="M 10 40 L 190 15" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
          {/* New line */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
            d="M 10 40 L 190 65" stroke="#4ade80" strokeWidth="2" fill="none" 
          />
        </svg>

        {/* Moving package */}
        <motion.div
           initial={{ x: 10, y: 35, opacity: 0 }}
           animate={{ x: [10, 190], y: [35, 60], opacity: [0, 1, 1] }}
           transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
           className="absolute w-3 h-3 bg-white rounded-sm shadow-[0_0_8px_white] z-20"
        />
        
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ALTERNATE SUPPLIER SELECTED
// ─────────────────────────────────────────────────────────────────────────────
export function SupplierSelectionAnimation() {
  return (
    <div className="flex items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
       <div className="flex items-center gap-8 z-10">
          
          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
             <Box className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex flex-col gap-2 relative">
             <svg className="absolute -left-8 top-0 w-8 h-full" style={{ zIndex: -1 }}>
               <path d="M 0 35 L 30 10" stroke="#475569" fill="none" strokeWidth="1" opacity="0.3" />
               <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }} d="M 0 35 L 30 35" stroke="#4ade80" fill="none" strokeWidth="2" />
               <path d="M 0 35 L 30 60" stroke="#475569" fill="none" strokeWidth="1" opacity="0.3" />
             </svg>

             {/* Candidate 1 */}
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.2 }} className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-[9px] text-slate-400">Supp-A</motion.div>
             {/* Candidate 2 (Selected) */}
             <motion.div 
               initial={{ opacity: 0, borderColor: "#334155", backgroundColor: "#1e293b" }} 
               animate={{ opacity: 1, borderColor: "#4ade80", backgroundColor: "rgba(74,222,128,0.1)" }} 
               transition={{ opacity: { delay: 0.4 }, borderColor: { delay: 1 }, backgroundColor: { delay: 1 } }} 
               className="px-2 py-1 rounded border text-[10px] font-bold text-emerald-400 flex items-center gap-1"
             >
                <CheckCircle2 className="w-3 h-3" /> Supp-B
             </motion.div>
             {/* Candidate 3 */}
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.6 }} className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-[9px] text-slate-400">Supp-C</motion.div>
          </div>
       </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. INVENTORY REALLOCATED
// ─────────────────────────────────────────────────────────────────────────────
export function InventoryAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
      <div className="flex items-center gap-12 z-10">
        
        {/* Whse A */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-slate-500">WHSE A</span>
          <div className="grid grid-cols-2 gap-1">
             {[1,2,3,4].map(i => (
                <motion.div 
                  key={i}
                  animate={{ opacity: (i===3 || i===4) ? 0 : 1 }}
                  transition={{ delay: 1 }}
                  className="w-3 h-3 bg-indigo-400 rounded-sm" 
                />
             ))}
          </div>
        </div>

        {/* Moving items */}
        <div className="relative w-16 h-4">
           <svg className="absolute inset-0 w-full h-full"><path d="M 0 8 L 64 8" stroke="#475569" strokeDasharray="2 2" fill="none" /></svg>
           <motion.div 
             initial={{ x: 0, opacity: 0 }}
             animate={{ x: 60, opacity: [0,1,1,0] }}
             transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
             className="absolute top-1 w-3 h-3 bg-indigo-400 rounded-sm"
           />
        </div>

        {/* Whse B */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-emerald-500">WHSE B</span>
          <div className="grid grid-cols-2 gap-1">
             {[1,2].map(i => <div key={i} className="w-3 h-3 bg-emerald-400/20 border border-emerald-500/40 rounded-sm" />)}
             {[3,4].map(i => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 }}
                  className="w-3 h-3 bg-emerald-400 rounded-sm" 
                />
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. RISK REDUCED
// ─────────────────────────────────────────────────────────────────────────────
export function RiskReductionAnimation() {
  const [val, setVal] = useState(87);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
       let current = 87;
       const int = setInterval(() => {
         current -= 3;
         if (current <= 28) {
           current = 28;
           clearInterval(int);
         }
         setVal(current);
       }, 30);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 h-32 bg-slate-900/50 rounded-lg border border-slate-800 relative overflow-hidden mb-3">
      <div className="flex items-center gap-4 z-10">
         <ShieldCheck className="w-8 h-8 text-emerald-400" />
         <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 tracking-widest uppercase font-bold mb-1">System Risk Score</span>
            <div className="flex items-end gap-2">
               <span className="text-3xl font-mono font-bold" style={{ color: val > 60 ? "#ef4444" : val > 40 ? "#f59e0b" : "#4ade80" }}>
                 {val}
               </span>
               <span className="text-xs text-slate-500 font-mono mb-1">/100</span>
            </div>
         </div>
      </div>
      <motion.div 
         initial={{ width: "87%", backgroundColor: "#ef4444" }}
         animate={{ width: "28%", backgroundColor: "#4ade80" }}
         transition={{ delay: 0.5, duration: 1 }}
         className="absolute bottom-0 left-0 h-1"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY MAPPER
// ─────────────────────────────────────────────────────────────────────────────
export function AuditAnimationFactory({ eventType }) {
  const [key, setKey] = useState(0);

  // A tiny replay button wrapper
  const replay = (e) => {
    e.stopPropagation();
    setKey(k => k + 1);
  };

  const renderAnim = () => {
    switch (eventType) {
      case "DISRUPTION_DETECTED": return <DisruptionAnimation key={key} />;
      case "INVESTIGATION_COMPLETED": return <InvestigationAnimation key={key} />;
      case "RECOVERY_RECOMMENDATION": return <RecoveryAnimation key={key} />;
      case "BUYER_DECISION_REQUESTED": return <DecisionPendingAnimation key={key} />;
      case "REROUTE_APPROVED": return <RerouteAnimation key={key} />;
      case "SHIPMENT_REROUTED": return <RerouteAnimation key={key} />;
      case "ALTERNATE_SUPPLIER_SELECTED": return <SupplierSelectionAnimation key={key} />;
      case "INVENTORY_REALLOCATED": return <InventoryAnimation key={key} />;
      case "RISK_REDUCED": return <RiskReductionAnimation key={key} />;
      case "BUYER_NOTIFIED": 
        return (
          <div key={key} className="flex items-center justify-center h-32 bg-slate-900/50 rounded-lg border border-slate-800 mb-3 relative overflow-hidden">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 20, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Bell className="w-6 h-6 text-indigo-400" />
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  const anim = renderAnim();
  if (!anim) return null;

  return (
    <div className="relative group">
      {anim}
      <button 
        onClick={replay}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white hover:bg-slate-700"
        title="Replay Animation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
      </button>
    </div>
  );
}
