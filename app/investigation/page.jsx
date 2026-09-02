"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { InvestigationCopilot } from "@/components/ui/InvestigationCopilot";
import { RoleGuard } from "@/components/ui/RoleGuard";
import { Search, Activity, Zap, Users, Cloud, Truck, TrendingUp, AlertTriangle, HelpCircle, CheckCircle2 } from "lucide-react";

export default function DisruptionInvestigation() {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Simulate AI loading/scanning for 2.5 seconds
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const signals = [
    {
      id: "s1",
      source: "FACTORY TELEMETRY",
      icon: <Activity className="h-4 w-4" />,
      status: "CRITICAL",
      time: "20:56",
      confidence: 99,
      finding: "Machine downtime spiked across 4 lines. IoT sensors report zero output.",
      delay: "0ms"
    },
    {
      id: "s2",
      source: "POWER SIGNAL",
      icon: <Zap className="h-4 w-4" />,
      status: "CONFIRMED",
      time: "20:58",
      confidence: 94,
      finding: "Grid power interruption detected in affected industrial region (Sector 4).",
      delay: "400ms"
    },
    {
      id: "s3",
      source: "SUPPLIER SIGNAL",
      icon: <Users className="h-4 w-4" />,
      status: "UNREACHABLE",
      time: "21:02",
      confidence: 85,
      finding: "Automated ping to supplier ERP timed out. Local network likely down.",
      delay: "800ms"
    },
    {
      id: "s4",
      source: "WEATHER SIGNAL",
      icon: <Cloud className="h-4 w-4" />,
      status: "CLEAR",
      time: "21:05",
      confidence: 98,
      finding: "No severe weather events in the region. Disruption isolated to infrastructure.",
      delay: "1200ms"
    },
    {
      id: "s5",
      source: "LOGISTICS SIGNAL",
      icon: <Truck className="h-4 w-4" />,
      status: "WARNING",
      time: "21:10",
      confidence: 76,
      finding: "Inbound fleet reporting delays at checkpoint 3 due to local traffic gridlock.",
      delay: "1600ms"
    },
    {
      id: "s6",
      source: "MARKET SIGNAL",
      icon: <TrendingUp className="h-4 w-4" />,
      status: "NOMINAL",
      time: "21:12",
      confidence: 91,
      finding: "No broader market shocks or raw material price spikes detected.",
      delay: "2000ms"
    }
  ];

  return (
    <RoleGuard allowedRole="owner">
    <div className="flex h-screen bg-[#06090F] text-slate-100 overflow-hidden font-body selection:bg-indigo-500/30">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-8 py-10 relative">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          
          {/* Header */}
          <header className="mb-10 pb-6 border-b border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white mb-2">
                  <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                    <Search className="h-5 w-5" />
                  </span>
                  Disruption Investigation
                </h1>
                <p className="text-slate-400 text-sm">Multi-source signal telemetry and AI root cause synthesis</p>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Case ID</div>
                <div className="text-2xl font-bold font-mono text-slate-200">TL-4821</div>
              </div>
            </div>

            {/* Status Bar */}
            <div className={`mt-6 p-4 rounded-lg border flex items-center justify-between overflow-hidden relative transition-all duration-1000 ${
              isScanning ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-slate-900 border-slate-800'
            }`}>
              {isScanning && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full animate-[scan_2s_ease-in-out_infinite]" />
              )}
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative flex h-3 w-3">
                  {isScanning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isScanning ? 'bg-indigo-500' : 'bg-slate-600'}`}></span>
                </div>
                <span className={`text-sm font-bold tracking-widest uppercase ${isScanning ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {isScanning ? 'Investigating Signals...' : 'Investigation Complete'}
                </span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Evidence Cards */}
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Signal Telemetry
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {signals.map((sig) => (
                  <div 
                    key={sig.id} 
                    className={`bg-[#0B101A] border border-slate-800 rounded-xl p-5 relative overflow-hidden transition-all duration-700
                      ${isScanning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                    `}
                    style={{ transitionDelay: isScanning ? '0ms' : sig.delay }}
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <div className="text-slate-500">{sig.icon}</div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{sig.source}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{sig.time}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider
                        ${sig.status === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          sig.status === 'CONFIRMED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          sig.status === 'WARNING' || sig.status === 'UNREACHABLE' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}
                      `}>
                        {sig.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono border border-slate-800 px-1.5 py-0.5 rounded-sm">
                        {sig.confidence}% CONF
                      </span>
                    </div>

                    <div className="text-sm text-slate-300 leading-relaxed font-medium">
                      <span className="text-slate-500 font-normal">Finding:</span> {sig.finding}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Synthesis */}
            <div className="col-span-1 space-y-6">
              
              {/* Root Cause */}
              <div className={`bg-gradient-to-b from-[#111827] to-[#0B101A] border border-indigo-500/20 rounded-xl overflow-hidden transition-all duration-1000 delay-1000 ${isScanning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="p-4 bg-indigo-500/5 border-b border-indigo-500/10 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-indigo-400" />
                  <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Root Cause Synthesis</h2>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">For Factory Owner</span>
                  <p className="text-lg font-bold text-slate-100 mb-4 leading-snug">
                    Grid power interruption affecting Sector 4.
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Overall AI Confidence</span>
                    <span className="text-lg font-mono text-indigo-400">94%</span>
                  </div>
                </div>
              </div>

              {/* Information Gaps */}
              <div className={`bg-[#0B101A] border border-slate-800 rounded-xl overflow-hidden transition-all duration-1000 delay-[2200ms] ${isScanning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-slate-500" />
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Information Gaps</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 font-medium">Supplier Recovery Schedule</span>
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">UNVERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 font-medium">Alternate Capacity</span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">PENDING</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 font-medium">Pickup Slot</span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">PENDING</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Investigation Copilot — context-aware AI agent */}
      <InvestigationCopilot />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
    </RoleGuard>
  );
}