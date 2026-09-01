import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function RouteCheckpoint({ node, status, onAnimationComplete }) {
  const isUpcoming = status === "UPCOMING";
  const isCurrent = status === "CURRENT";
  const isCompleting = status === "COMPLETING";
  const isCompleted = status === "COMPLETED";
  const isDisrupted = status === "DISRUPTED";

  useEffect(() => {
    if (isCompleting && onAnimationComplete) {
      // The tick animation takes ~600ms, plus 100ms scale delay. 
      // We can use setTimeout or Framer Motion's onAnimationComplete on the path.
      // We will do it via a timeout here for absolute safety and simplicity.
      const timer = setTimeout(() => {
        onAnimationComplete(node.id);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isCompleting, onAnimationComplete, node.id]);

  return (
    <div className="flex flex-col items-center relative z-10 w-24">
      {/* Node Circle */}
      <div className="h-10 flex items-center justify-center relative">
        {/* Subtle pulse if current */}
        {isCurrent && (
          <motion.div 
            className="absolute inset-0 bg-white rounded-full opacity-20"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Red pulse if disrupted */}
        {isDisrupted && (
          <motion.div 
            className="absolute -inset-2 border-2 border-red-500 rounded-full opacity-50"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        <motion.div
          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
            isCompleted || isCompleting ? "bg-teal-500 border-teal-500" :
            isDisrupted ? "bg-red-500 border-red-500" :
            isCurrent ? "bg-white border-white" : "bg-[#0f172a] border-slate-600"
          }`}
          initial={{ scale: 1 }}
          animate={isCompleting ? { scale: [0.85, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDisrupted && (
             <AlertCircle className="w-4 h-4 text-white" />
          )}
          
          {(isCompleting || isCompleted) && (
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white relative z-10">
               <motion.path
                 d="M20 6L9 17L4 12"
                 stroke="currentColor"
                 strokeWidth="3"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 initial={isCompleting ? { pathLength: 0 } : { pathLength: 1 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
               />
             </svg>
          )}
        </motion.div>
      </div>
      
      {/* Label */}
      <div className={`text-xs font-semibold text-center mt-2 transition-colors duration-300 ${
        isCompleted ? "text-teal-400" :
        isDisrupted ? "text-red-400" :
        isCurrent ? "text-white" : "text-slate-500"
      }`}>
        {node.name}
        {node.isAlternate && <div className="text-[10px] text-teal-500 mt-1 uppercase tracking-wider">Alternate</div>}
      </div>
    </div>
  );
}
