"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { factories } from "@/lib/clusterData";
import { Activity, ShieldAlert, Package, CheckCircle2 } from "lucide-react";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { RoleGuard } from "@/components/ui/RoleGuard";

import { ProcessWheel } from "./components/ProcessWheel";
import { SupplyChainGraph } from "./components/SupplyChainGraph";
import { useDisruption } from "@/lib/disruptionContext";
import { useRole } from "@/lib/roleContext";
import { Bot, RotateCcw } from "lucide-react";

export default function MyNetworkPage() {
  const { role } = useRole();
  const isBuyer = role === "buyer";
  const TARGET_FACTORY_ID = "F-013";
  const [factoryData, setFactoryData] = useState(null);
  
  const { activeDisruption } = useDisruption();
  const [networkPhase, setNetworkPhase] = useState("NORMAL"); // NORMAL, DISRUPTION, AI_SEARCH, REROUTING, RECOVERED

  useEffect(() => {
    const f = factories.find(f => f.id === TARGET_FACTORY_ID);
    if (f) {
      setFactoryData({ ...f });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromRecovery = params.get('fromRecovery') === 'true';

    if (fromRecovery && activeDisruption) {
      setNetworkPhase("DISRUPTION");
      
      const t1 = setTimeout(() => setNetworkPhase("AI_SEARCH"), 2000);
      const t2 = setTimeout(() => setNetworkPhase("REROUTING"), 5000);
      const t3 = setTimeout(() => setNetworkPhase("RECOVERED"), 7500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setNetworkPhase("NORMAL");
    }
  }, [activeDisruption]);

  const runAnimation = () => {
    setNetworkPhase("DISRUPTION");
    setTimeout(() => setNetworkPhase("AI_SEARCH"), 2000);
    setTimeout(() => setNetworkPhase("REROUTING"), 5000);
    setTimeout(() => setNetworkPhase("RECOVERED"), 7500);
  };

  if (!factoryData) return null;

  return (
    <RoleGuard allowedRole="owner">
      <div className="flex h-screen bg-[#0B0F17] text-slate-100 overflow-hidden font-body selection:bg-teal-500 selection:text-white">
        {/* Global Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto relative p-8 gap-10">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes data-slide {
              from { transform: translateY(10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .card-enter {
              animation: data-slide 0.4s ease-out forwards;
            }
          `}} />

          {/* SECTION 1: MY FACTORY */}
          <div className="card-enter" style={{animationDelay: '0.1s'}}>
            <div className="flex justify-between items-end border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">My Factory</h2>
                <h1 className="text-3xl font-display font-semibold tracking-tight">Suresh Textiles</h1>
                <p className="text-slate-400 mt-1 flex items-center gap-2">
                  <span className="text-sm tracking-widest uppercase">Tiruppur, Tamil Nadu</span>
                  <span className="text-slate-700">•</span>
                  <span className="text-sm">ID: {factoryData.id}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-4 py-2 rounded-lg">
                  <Activity className="h-5 w-5" />
                  <span className="font-semibold text-sm tracking-wide">OPERATIONAL</span>
                </div>
              </div>
            </div>

            {/* Compact Operational Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#111826] border border-slate-800 rounded-xl p-5 shadow-2xl">
              <MetricBox label="Capacity Utilization" value="78%" icon={<Activity className="h-4 w-4" />} />
              <MetricBox label="Active Orders" value="12" icon={<Package className="h-4 w-4" />} />
              <MetricBox label="On-time Delivery" value="92%" icon={<CheckCircle2 className="h-4 w-4" />} />
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Risk Score</span>
                </div>
                <div className="text-base font-semibold font-mono">
                  <ExplainableRiskScore score={12} type="Factory" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: PROCESSES PERFORMED */}
          <div className="card-enter flex flex-col gap-6" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-200">Processes Performed</h2>
                <p className="text-xs text-slate-500 mt-1">Select a process to view real-time capacity and machine status.</p>
              </div>
            </div>
            <ProcessWheel />
          </div>

          {/* SECTION 3: MY SUPPLY CHAIN NETWORK */}
          <div className="card-enter flex flex-col gap-6" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-200">My Supply Chain Network</h2>
                <p className="text-xs text-slate-500 mt-1">Direct dependencies mapped to your facility.</p>
              </div>
              {activeDisruption && (
                <button 
                  onClick={runAnimation}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Network Event
                </button>
              )}
            </div>

            {/* AI Context Banner */}
            {activeDisruption && networkPhase !== "NORMAL" && (
              <div className="bg-[#111826] border border-blue-900/40 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg shrink-0 relative">
                  <Bot className="w-5 h-5" />
                  {networkPhase === "AI_SEARCH" && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">ThreadLine AI Copilot</h3>
                  <p className="text-sm font-medium text-slate-300">
                    {networkPhase === "DISRUPTION" && `ThreadLine detected a disruption: ${isBuyer ? activeDisruption.buyerView?.title || "SUPPLY DELAY RISK" : activeDisruption.title}. Mapping network impact...`}
                    {networkPhase === "AI_SEARCH" && "Analyzing network alternatives and rerouting capacity..."}
                    {networkPhase === "REROUTING" && "Optimal alternative identified. Rerouting supply flow..."}
                    {networkPhase === "RECOVERED" && "Network recovery active. Flow has been successfully rerouted."}
                  </p>
                </div>
              </div>
            )}

            <SupplyChainGraph 
              activeDisruption={activeDisruption} 
              networkPhase={networkPhase} 
            />
            
            {/* Summary Footer */}
            <div className="bg-[#111826] border border-slate-800 rounded-xl p-6 shadow-2xl flex items-center justify-between mb-8 mt-4">
              <div className="flex items-center gap-12">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Connections</p>
                  <p className="text-xl font-bold text-slate-200">7</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-500/80 uppercase tracking-widest mb-1">On Track</p>
                  <p className="text-xl font-bold text-emerald-400">6</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-500/80 uppercase tracking-widest mb-1">At Risk</p>
                  <p className="text-xl font-bold text-amber-400">1</p>
                </div>
                <div>
                  <p className="text-[10px] text-red-500/80 uppercase tracking-widest mb-1">Down</p>
                  <p className="text-xl font-bold text-red-400">0</p>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden md:block"></div>

              <div className="flex items-center gap-12">
                <div>
                  <p className="text-[10px] text-amber-500/80 uppercase tracking-widest mb-1">Orders At Risk</p>
                  <p className="text-xl font-bold text-amber-400">{activeDisruption ? activeDisruption.ordersAffected : 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-500/80 uppercase tracking-widest mb-1">Est. Delay</p>
                  <p className="text-xl font-bold text-amber-400">
                    {activeDisruption 
                      ? (networkPhase === "RECOVERED" && activeDisruption.recovery ? `+${activeDisruption.recovery.delayHours}h` : `+${activeDisruption.delayHours}h`) 
                      : '+0h'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-red-500/80 uppercase tracking-widest mb-1">Risk Score</p>
                  <p className="text-xl font-bold text-red-400">
                    {activeDisruption 
                      ? (networkPhase === "RECOVERED" && activeDisruption.recovery ? activeDisruption.recovery.riskScore : activeDisruption.riskScore) 
                      : 12}
                  </p>
                </div>
              </div>

              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs tracking-wider uppercase font-bold rounded-lg shadow-sm transition-all">
                View Recovery Options
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </RoleGuard>
  );
}

function MetricBox({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
        <div className="p-2 bg-slate-900 rounded-lg">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-base font-semibold font-mono text-slate-200">
        {value}
      </div>
    </div>
  );
}
