"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings2, Scissors, 
  Droplets, Blend, Shirt, Share2
} from "lucide-react";

const PROCESSES = [
  { id: "spinning", label: "Spinning", icon: Settings2, capacity: 92, target: "12,000 kg", output: "11,040 kg", machines: 14 },
  { id: "weaving", label: "Weaving", icon: Blend, capacity: 78, target: "11,000 m", output: "8,450 m", machines: 24 },
  { id: "knitting", label: "Knitting", icon: Share2, capacity: 85, target: "5,000 kg", output: "4,250 kg", machines: 10 },
  { id: "dyeing", label: "Dyeing", icon: Droplets, capacity: 60, target: "15,000 m", output: "9,000 m", machines: 8 },
  { id: "finishing", label: "Finishing", icon: Scissors, capacity: 88, target: "20,000 m", output: "17,600 m", machines: 6 },
  { id: "garmenting", label: "Garmenting", icon: Shirt, capacity: 95, target: "5,000 pcs", output: "4,750 pcs", machines: 50 },
];

export function ProcessWheel() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to Weaving (index 1)
  
  const total = PROCESSES.length;
  // We want the active item to be at the top (which in CSS translate/rotate math is often 0 or -90 deg depending on starting point).
  // Let's say item 0 is at 0 degrees (top). Item i is at i * (360/total).
  // If activeIndex is k, we must rotate the whole wheel by -k * (360/total) so that k ends up at 0 degrees (top).
  const anglePerItem = 360 / total;
  const wheelRotation = -activeIndex * anglePerItem;

  const activeProcess = PROCESSES[activeIndex];
  const Icon = activeProcess.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
      
      {/* Visual Wheel Area */}
      <div className="col-span-2 relative h-[500px] bg-[#111826] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
        
        {/* Background Decorative Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[380px] h-[380px] rounded-full border border-slate-800/60 border-dashed"></div>
          <div className="absolute w-[260px] h-[260px] rounded-full border border-slate-800/40"></div>
        </div>

        {/* The Rotating Wheel */}
        <motion.div 
          className="relative w-[380px] h-[380px]"
          animate={{ rotate: wheelRotation }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          {PROCESSES.map((proc, index) => {
            const angle = index * anglePerItem;
            // Position nodes along the circle. (0deg is top).
            // Using standard transform math: rotate then translate.
            const isSelected = index === activeIndex;
            const ProcIcon = proc.icon;

            return (
              <motion.div
                key={proc.id}
                className="absolute top-1/2 left-1/2 -mt-7 -ml-7 w-14 h-14"
                style={{
                  transformOrigin: "50% 50%",
                  transform: `rotate(${angle}deg) translateY(-190px)`,
                }}
              >
                {/* 
                  Counter-rotate the inner content so it stays upright! 
                  Since the parent wheel rotated by `wheelRotation`, and this item rotated by `angle` to get to its orbit position,
                  the total absolute rotation of this item is `wheelRotation + angle`.
                  To keep it upright, we must apply the inverse: -(wheelRotation + angle).
                */}
                <motion.button
                  onClick={() => setActiveIndex(index)}
                  animate={{ rotate: -(wheelRotation + angle) }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 border-2 shadow-lg group ${
                    isSelected 
                      ? "bg-blue-600 border-blue-400 text-white scale-125 shadow-blue-900/50 z-20" 
                      : "bg-[#0B0F17] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 z-10 cursor-pointer"
                  }`}
                >
                  <ProcIcon className={`w-5 h-5 ${isSelected ? "" : "opacity-70 group-hover:opacity-100"}`} />
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center Display (Static, doesn't rotate with wheel) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0B0F17] rounded-full border-4 border-slate-800/80 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center pointer-events-none z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProcess.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-900/40 text-blue-400 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-widest">{activeProcess.label}</h3>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
                Capacity: <span className="text-blue-400">{activeProcess.capacity}%</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="col-span-1 bg-[#111826] rounded-2xl border border-slate-800 shadow-2xl p-6 flex flex-col">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">Process Details</h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProcess.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-900/30 text-blue-500 rounded-lg">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight">{activeProcess.label}</h3>
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Running
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Machine Status</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-bold text-slate-200">{activeProcess.machines}</p>
                  </div>
                  <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30">
                    <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider">Running</p>
                    <p className="text-lg font-bold text-emerald-400">{Math.floor(activeProcess.machines * (activeProcess.capacity/100))}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Production Volume</p>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Today's Output</p>
                      <p className="text-xl font-bold text-slate-200">{activeProcess.output}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Target</p>
                      <p className="text-sm font-medium text-slate-300">{activeProcess.target}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeProcess.capacity}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs tracking-wider uppercase font-semibold rounded-lg transition-colors border border-slate-700">
                View Machines
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
