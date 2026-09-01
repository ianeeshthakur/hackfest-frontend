import React from "react";
import { motion } from "framer-motion";
import { Ship } from "lucide-react";

export function AnimatedShip({ progressPercent }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none"
      initial={{ left: "0%" }}
      animate={{ left: `${progressPercent}%` }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{ marginLeft: "-16px" }}
    >
      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-900 shadow-md flex items-center justify-center">
        <Ship className="w-4 h-4 text-slate-900" />
      </div>
    </motion.div>
  );
}

export function RouteProgress({ progressPercent }) {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-700/50 rounded-full overflow-hidden pointer-events-none">
      <motion.div
        className="h-full bg-teal-500"
        initial={{ width: "0%" }}
        animate={{ width: `${progressPercent}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  );
}
