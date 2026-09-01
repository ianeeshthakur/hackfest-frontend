"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export function ExplainableRiskScore({ score, type = "Risk", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate fractions based on the total score and formula:
  // 30% Disruption, 25% Deadline, 15% Capacity, 15% Supplier, 15% Recovery
  const disruption = Math.round(score * 0.30);
  const deadline = Math.round(score * 0.25);
  const capacity = Math.round(score * 0.15);
  const supplier = Math.round(score * 0.15);
  const recovery = Math.round(score * 0.15);
  
  // To avoid rounding errors making the sum != score, we adjust the largest weight
  const sum = disruption + deadline + capacity + supplier + recovery;
  const diff = score - sum;
  const finalDisruption = disruption + diff;

  const isHighRisk = score > 50;

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} ref={popoverRef}>
      
      {/* Base Score Display */}
      <div 
        className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800/50 p-1.5 -ml-1.5 rounded-md transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className={`font-semibold ${isHighRisk ? 'text-red-400' : 'text-slate-400'}`}>
          {score}/100
        </span>
        <Info className={`h-4 w-4 ${isHighRisk ? 'text-red-500/70' : 'text-slate-500'} group-hover:text-blue-400 transition-colors`} />
      </div>

      {/* Popover */}
      {isOpen && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-5 z-50 animate-popover-up"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-slate-900 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 bg-blue-900/40 border border-blue-800 text-blue-400 text-[9px] uppercase tracking-widest font-bold rounded-sm">
              Simulated Demo Scoring Model
            </span>
          </div>

          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
            How is this risk score calculated?
          </h4>

          {/* Factors */}
          <div className="space-y-3 mb-5">
            <FactorBar label="Disruption Severity" value={finalDisruption} max={30} color="bg-red-500" delay="0ms" />
            <FactorBar label="Deadline Proximity" value={deadline} max={25} color="bg-orange-500" delay="100ms" />
            <FactorBar label="Capacity Constraint" value={capacity} max={15} color="bg-amber-500" delay="200ms" />
            <FactorBar label="Supplier Dependency" value={supplier} max={15} color="bg-yellow-500" delay="300ms" />
            <FactorBar label="Recovery Difficulty" value={recovery} max={15} color="bg-blue-500" delay="400ms" />
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-slate-700 pt-3 mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total {type} Risk</span>
            <span className="text-lg font-bold text-slate-100">{score} <span className="text-sm text-slate-500 font-normal">/ 100</span></span>
          </div>

          {/* Drivers & Mitigators */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-2">Risk Drivers</span>
              <ul className="text-[11px] text-slate-300 space-y-1.5 leading-tight">
                {score > 60 && <li className="flex items-start gap-1"><span className="text-red-500 mt-0.5">•</span> High disruption severity</li>}
                <li className="flex items-start gap-1"><span className="text-red-500 mt-0.5">•</span> Deadline approaching</li>
                {capacity > 5 && <li className="flex items-start gap-1"><span className="text-red-500 mt-0.5">•</span> Reduced production capacity</li>}
                {recovery > 5 && <li className="flex items-start gap-1"><span className="text-red-500 mt-0.5">•</span> Limited recovery window</li>}
              </ul>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">Mitigating Factors</span>
              <ul className="text-[11px] text-slate-300 space-y-1.5 leading-tight">
                <li className="flex items-start gap-1"><span className="text-emerald-500 mt-0.5">•</span> Alternate supplier available</li>
                <li className="flex items-start gap-1"><span className="text-emerald-500 mt-0.5">•</span> Certification matched</li>
              </ul>
            </div>
          </div>

          {/* Injecting specific animation styles here so it's fully encapsulated */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes popover-up {
              from { opacity: 0; transform: translate(-50%, 10px) scale(0.95); }
              to { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
            .animate-popover-up {
              animation: popover-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes bar-fill {
              from { width: 0%; }
            }
          `}} />
        </div>
      )}
    </div>
  );
}

function FactorBar({ label, value, max, color, delay }) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-mono">{value} <span className="text-slate-600">/ {max}</span></span>
      </div>
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full`} 
          style={{ 
            width: `${percentage}%`, 
            animation: `bar-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay} forwards` 
          }} 
        />
      </div>
    </div>
  );
}
