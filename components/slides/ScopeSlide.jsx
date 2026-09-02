"use client";

import React from "react";
import { motion } from "framer-motion";

export function ScopeSlide() {
  const phases = [
    {
      num: 1,
      title: "Fiber Sourcing",
      local: "Crop failure, local shortage",
      global: "Tariffs, climate shocks"
    },
    {
      num: 2,
      title: "Spinning",
      local: "Power outage, equipment\nbreakdown",
      global: "Global yarn price swings"
    },
    {
      num: 3,
      title: "Weaving / Knitting",
      local: "Yarn shortage, labor\ndispute",
      global: "Import / parts disruption"
    },
    {
      num: 4,
      title: "Dyeing & Finishing",
      local: "Power cut, chemical\nshortage",
      global: "—",
      highlight: true
    },
    {
      num: 5,
      title: "Garmenting",
      local: "Delay, quality issues",
      global: "—"
    },
    {
      num: 6,
      title: "Export & Delivery",
      local: "—",
      global: "Red Sea disruption, EU\nDPP"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const arrowVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: { scaleX: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white p-12 lg:p-16 relative overflow-hidden font-sans">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-[#e26723] font-bold tracking-widest text-sm mb-4 uppercase">Full Scope</h2>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a2f64]">
          Six phases, two kinds of risk — not just the shipping leg
        </h1>
      </motion.div>

      {/* Columns Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-1 w-full gap-2 relative z-10 items-stretch h-full"
      >
        {/* Animated connecting line through the circles */}
        <motion.div 
          className="absolute top-[48px] left-[8%] right-[8%] h-[2px] bg-[#e26723]/30 z-0 hidden md:block"
          style={{ originX: 0 }}
          variants={arrowVariants}
        />

        {phases.map((phase, idx) => (
          <motion.div
            key={phase.num}
            variants={itemVariants}
            className={`flex-1 flex flex-col items-center pt-8 pb-12 px-2 text-center rounded-sm transition-colors
              ${phase.highlight ? "bg-[#cf5f22] text-white shadow-lg z-20" : "bg-[#f5f2eb] text-[#1a2f64]"}
            `}
          >
            {/* Number Circle */}
            <div 
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-8 z-10
                ${phase.highlight ? "bg-white text-[#cf5f22]" : "bg-[#1a2f64] text-white"}
              `}
            >
              {phase.num}
            </div>

            <h3 className="font-bold text-[15px] md:text-lg mb-12 h-12 flex items-center justify-center">
              {phase.title}
            </h3>

            {/* Local Section */}
            <div className="w-full mb-12">
              <h4 className={`text-xs font-bold mb-4 tracking-widest
                ${phase.highlight ? "text-white/90" : "text-[#e26723]"}
              `}>
                LOCAL
              </h4>
              <p className={`text-xs md:text-sm whitespace-pre-wrap px-1
                ${phase.highlight ? "text-white font-medium" : "text-[#4b5563]"}
              `}>
                {phase.local}
              </p>
            </div>

            {/* Global Section */}
            <div className="w-full">
              <h4 className={`text-xs font-bold mb-4 tracking-widest
                ${phase.highlight ? "text-white/90" : "text-[#1a2f64]"}
              `}>
                GLOBAL
              </h4>
              <p className={`text-xs md:text-sm whitespace-pre-wrap px-1
                ${phase.highlight ? "text-white font-medium" : "text-[#4b5563]"}
              `}>
                {phase.global}
              </p>
            </div>
            
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="mt-8 flex justify-between items-end text-sm text-gray-500 italic"
      >
        <p>Phase 4 — Dyeing & Finishing — is our live demo. The full chain is the vision.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="mt-4 flex justify-between items-end text-[10px] text-gray-400 font-medium tracking-widest uppercase"
      >
        <span>THREADLINE</span>
        <span>5</span>
      </motion.div>
    </div>
  );
}
