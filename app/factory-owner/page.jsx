"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { factories, simulateDisruption } from "@/lib/clusterData";
import { Activity, Zap, Users, Factory, Package, AlertTriangle, Play } from "lucide-react";

export default function FactoryOwnerDashboard() {
  // Hardcoded to F-013 (Tiruppur Cotton Spinning Mill) to act as "Suresh Textiles"
  const TARGET_FACTORY_ID = "F-013";
  
  const [factoryData, setFactoryData] = useState(null);
  const [activeDisruption, setActiveDisruption] = useState(null);

  // Orders State (Mocked)
  const [orders, setOrders] = useState([
    { id: "TX-2048", product: "Cotton Twill", qty: "12,000 m", deadline: "Sep 04", prod: 72, risk: 12, status: "ON TRACK" },
    { id: "TX-3011", product: "Polyester Blend", qty: "8,500 m", deadline: "Sep 06", prod: 45, risk: 8, status: "ON TRACK" },
    { id: "TX-4402", product: "Linen Yarn", qty: "5,000 m", deadline: "Sep 12", prod: 10, risk: 5, status: "ON TRACK" },
  ]);

  // Factory Metrics State
  const [metrics, setMetrics] = useState({
    machineUptime: 97.2,
    workerAvailability: 94,
    powerStatus: "STABLE",
    capacityUtil: 78,
    orderLoad: 82
  });

  useEffect(() => {
    // On load, fetch current global state of the factory
    const f = factories.find(f => f.id === TARGET_FACTORY_ID);
    if (f) {
      setFactoryData({ ...f });
      if (f.status !== "OPERATIONAL") {
        setActiveDisruption(f.disruption);
      }
    }
  }, []);

  const handleSimulateDisruption = (type) => {
    // 1. Mutate Global Data
    const updatedFactory = simulateDisruption(TARGET_FACTORY_ID, type);
    setFactoryData({ ...updatedFactory });
    setActiveDisruption(type);

    // 2. Update Local Dashboard Metrics
    if (type === "Power Cut") {
      setMetrics({
        machineUptime: 62.4,
        workerAvailability: 94,
        powerStatus: "DISRUPTED",
        capacityUtil: 50,
        orderLoad: 82
      });
      
      setOrders(prev => prev.map(o => 
        o.id === "TX-2048" ? { ...o, risk: 72, status: "AT RISK" } : 
        o.id === "TX-3011" ? { ...o, risk: 65, status: "AT RISK" } : o
      ));
    } else if (type === "Worker Shortage") {
      setMetrics({
        ...metrics,
        workerAvailability: 64,
        capacityUtil: 60,
      });
      setOrders(prev => prev.map(o => 
        o.id === "TX-2048" ? { ...o, risk: 55, status: "DELAYED" } : o
      ));
    } else {
      // General disruption mapping
      setMetrics({
        ...metrics,
        capacityUtil: 40,
        machineUptime: 45,
      });
      setOrders(prev => prev.map(o => ({ ...o, risk: 80, status: "AT RISK" })));
    }
  };

  const handleReset = () => {
    const updatedFactory = simulateDisruption(TARGET_FACTORY_ID, "RESET");
    setFactoryData({ ...updatedFactory });
    setActiveDisruption(null);
    setMetrics({
      machineUptime: 97.2,
      workerAvailability: 94,
      powerStatus: "STABLE",
      capacityUtil: 78,
      orderLoad: 82
    });
    setOrders(prev => prev.map(o => ({ ...o, risk: Math.floor(Math.random()*15), status: "ON TRACK" })));
  };

  if (!factoryData) return null;

  const isDisrupted = factoryData.status !== "OPERATIONAL";

  return (
    <div className="flex h-screen bg-[#0B0F17] text-slate-100 overflow-hidden font-body selection:bg-teal-500 selection:text-white">
      {/* Global Sidebar */}
      <Sidebar />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative p-8 gap-8">
        
        {/* Custom plain CSS for specific animations requested */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          .animate-pulse-red {
            animation: pulse-red 2s infinite;
          }
          
          @keyframes data-slide {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .card-enter {
            animation: data-slide 0.4s ease-out forwards;
          }
        `}} />

        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-800 pb-4 card-enter">
          <div>
            <h1 className="text-3xl font-display font-semibold tracking-tight">Suresh Textiles</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-sm tracking-widest uppercase">Tiruppur, Tamil Nadu</span>
              <span className="text-slate-700">•</span>
              <span className="text-sm">ID: {factoryData.id}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDisrupted ? (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-900 text-red-400 px-4 py-2 rounded-lg animate-pulse-red">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold text-sm tracking-wide">SYSTEM DISRUPTION</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-4 py-2 rounded-lg">
                <Activity className="h-5 w-5" />
                <span className="font-semibold text-sm tracking-wide">OPERATIONS NORMAL</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          
          {/* Left Column: Heartbeat & Simulator */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* FACTORY HEARTBEAT */}
            <div className="bg-[#111826] border border-slate-800 rounded-xl p-5 shadow-2xl card-enter" style={{animationDelay: '0.1s'}}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Factory Heartbeat
              </h2>
              
              <div className="flex flex-col gap-5">
                <MetricRow label="Machine Uptime" value={`${metrics.machineUptime}%`} icon={<Factory className="h-4 w-4" />} isBad={metrics.machineUptime < 80} />
                <MetricRow label="Worker Availability" value={`${metrics.workerAvailability}%`} icon={<Users className="h-4 w-4" />} isBad={metrics.workerAvailability < 80} />
                <MetricRow label="Power Status" value={metrics.powerStatus} icon={<Zap className="h-4 w-4" />} isBad={metrics.powerStatus === "DISRUPTED"} highlight />
                <MetricRow label="Capacity Utilization" value={`${metrics.capacityUtil}%`} icon={<Activity className="h-4 w-4" />} isBad={metrics.capacityUtil < 60} />
                <MetricRow label="Order Load" value={`${metrics.orderLoad}%`} icon={<Package className="h-4 w-4" />} />
              </div>
            </div>

            {/* SIMULATE DISRUPTION */}
            <div className="bg-[#111826] border border-slate-800 rounded-xl p-5 shadow-2xl card-enter" style={{animationDelay: '0.2s'}}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Simulate Disruption
              </h2>
              
              <div className="grid grid-cols-1 gap-3">
                <DisruptionBtn label="Power Cut" onClick={() => handleSimulateDisruption("Power Cut")} active={activeDisruption === "Power Cut"} />
                <DisruptionBtn label="Machine Breakdown" onClick={() => handleSimulateDisruption("Machine Breakdown")} active={activeDisruption === "Machine Breakdown"} />
                <DisruptionBtn label="Worker Shortage" onClick={() => handleSimulateDisruption("Worker Shortage")} active={activeDisruption === "Worker Shortage"} />
                <DisruptionBtn label="Raw Material Delay" onClick={() => handleSimulateDisruption("Raw Material Delay")} active={activeDisruption === "Raw Material Delay"} />
              </div>

              {activeDisruption && (
                <button 
                  onClick={handleReset}
                  className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs tracking-wider uppercase font-semibold rounded-lg transition-colors border border-slate-700"
                >
                  Reset Factory
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Active Orders */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-[#111826] border border-slate-800 rounded-xl flex-1 shadow-2xl overflow-hidden flex flex-col card-enter" style={{animationDelay: '0.3s'}}>
              <div className="p-5 border-b border-slate-800">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Active Orders
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-800">
                      <th className="py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                      <th className="py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                      <th className="py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                      <th className="py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
                      <th className="py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prod %</th>
                      <th className="py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                      <th className="py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {orders.map((order, i) => (
                      <tr key={order.id} className="hover:bg-slate-800/20 transition-colors" style={{ animation: `data-slide 0.3s ease-out ${0.4 + (i*0.1)}s forwards`, opacity: 0 }}>
                        <td className="py-4 px-5 font-mono text-sm text-slate-300">{order.id}</td>
                        <td className="py-4 px-5 text-sm text-slate-200">{order.product}</td>
                        <td className="py-4 px-5 text-sm text-slate-400">{order.qty}</td>
                        <td className="py-4 px-5 text-sm text-slate-400">{order.deadline}</td>
                        <td className="py-4 px-5 text-sm text-slate-300">
                          <div className="flex items-center gap-3">
                            <span>{order.prod}%</span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${order.prod}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm">
                          <span className={`${order.risk > 50 ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                            {order.risk}/100
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${
                            order.status === "AT RISK" 
                              ? 'bg-red-950/50 text-red-400 border-red-900/50' 
                              : order.status === "DELAYED"
                              ? 'bg-amber-950/50 text-amber-400 border-amber-900/50'
                              : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponents

function MetricRow({ label, value, icon, isBad, highlight }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
        <div className="p-2 bg-slate-900 rounded-lg">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <div className={`text-base font-semibold font-mono ${isBad ? 'text-red-400' : highlight ? 'text-emerald-400' : 'text-slate-200'}`}>
        {value}
      </div>
    </div>
  );
}

function DisruptionBtn({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-red-950/40 border-red-900 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}
