import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ServerCog } from "lucide-react";

export function DisruptionAlert({ simState }) {
  const isDisrupted = simState === "DISRUPTION_DETECTED" || simState === "ANALYZING";
  const isAnalyzing = simState === "ANALYZING";
  const isFound = simState === "ALTERNATIVE_FOUND";

  return (
    <div className="h-24 flex items-center justify-center -mt-6">
      <AnimatePresence mode="wait">
        {isDisrupted && !isAnalyzing && (
          <motion.div
            key="alert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 backdrop-blur-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">Nhava Sheva congestion &middot; Berth queue is holding the original vessel</span>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 backdrop-blur-sm"
          >
            <ServerCog className="w-4 h-4 animate-spin text-teal-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Logistics Agent</span>
              <span className="text-sm font-semibold">Analyzing alternate port...</span>
            </div>
          </motion.div>
        )}

        {isFound && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-sm font-semibold">Alternate route identified &middot; Mundra Port</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
