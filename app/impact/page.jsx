"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { useRole } from "@/lib/roleContext";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import { Package, X, ArrowRight, AlertTriangle, Clock, BarChart2 } from "lucide-react";
import { IMPACT_ORDERS as ORDERS } from "@/lib/data/impactOrders";

const TOP_METRICS = [
  { label: "Affected Orders", value: "3", icon: <Package className="h-4 w-4" />, color: "text-red-400" },
  { label: "Affected Quantity", value: "30,500 m", icon: <BarChart2 className="h-4 w-4" />, color: "text-amber-400" },
  { label: "Capacity Impact", value: "-28%", icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-400" },
  { label: "Inventory at Risk", value: "8,200 m", icon: <Package className="h-4 w-4" />, color: "text-orange-400" },
  { label: "Expected Delay", value: "+9h", icon: <Clock className="h-4 w-4" />, color: "text-amber-400" },
  { label: "Fulfillment Risk", value: "HIGH", icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-400" },
];

export default function ImpactInventory() {
  const { role } = useRole();
  const isBuyer = role === "buyer";
  const [selected, setSelected] = useState(null);

  const displayOrders = isBuyer ? ORDERS.filter(o => o.buyer.includes("Zara")) : ORDERS;
  const order = displayOrders.find(o => o.id === selected);

  return (
    <div className={`flex h-screen ${isBuyer ? "bg-slate-50 text-slate-900" : "bg-[#06090F] text-slate-100"} overflow-hidden font-body`}>
      <Sidebar />

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-slate-800 shrink-0">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                <BarChart2 className="h-5 w-5" />
              </span>
              <h1 className={`text-2xl font-bold tracking-tight ${isBuyer ? "text-slate-900" : "text-white"}`}>Impact & Inventory</h1>
            </div>
            <p className="text-slate-500 text-sm ml-[52px]">Real-time disruption impact on active orders and inventory levels — Case TL-4821</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-[1200px] mx-auto space-y-6">

            {/* Top Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {TOP_METRICS.map((m) => (
                <div key={m.label} className="bg-[#0B101A] border border-slate-800 rounded-xl p-4">
                  <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 ${m.color}`}>
                    {m.icon}
                    {m.label}
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-tight">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Main Content: Order List + Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

              {/* Order Cards */}
              <div className={`space-y-4 ${selected ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Affected Orders ({displayOrders.length})
                </h2>
                {displayOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelected(selected === o.id ? null : o.id)}
                    className={`w-full text-left bg-[#0B101A] border rounded-xl p-5 transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-900/10 cursor-pointer group ${
                      selected === o.id ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Info */}
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold font-mono text-slate-100">{o.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            o.status === 'AT RISK' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          }`}>{o.status}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                          <span className="font-medium text-slate-300">{o.product}</span>
                          <span>{o.qty}</span>
                          <span>Deadline: <span className="text-slate-300 font-medium">{o.deadline}</span></span>
                          <span>Buyer: <span className="text-slate-300 font-medium">{o.buyer}</span></span>
                        </div>
                      </div>

                      {/* Right Metrics */}
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-center">
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Delay</div>
                          <div className="text-sm font-bold text-amber-400">{o.delay}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Risk</div>
                          <ExplainableRiskScore score={o.risk} type="Order" />
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-colors ${selected === o.id ? 'text-amber-400' : 'text-slate-700 group-hover:text-slate-500'}`} />
                      </div>
                    </div>

                    {/* Progress Bar (always visible) */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                        <span>Production Progress</span>
                        <span className="font-mono text-slate-400">{o.prodProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${o.risk > 60 ? 'bg-red-500' : 'bg-amber-500'}`}
                          style={{ width: `${o.prodProgress}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Inspector Panel */}
              {selected && order && (
                <div className="lg:col-span-2">
                  <div className="bg-[#0B101A] border border-amber-500/20 rounded-xl overflow-hidden shadow-2xl shadow-amber-900/10 sticky top-0">

                    {/* Inspector Header */}
                    <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent">
                      <div>
                        <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Order Inspector</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">{order.id}</div>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-5 space-y-5">
                      {/* Order Profile */}
                      <section>
                        <SectionLabel>Order Profile</SectionLabel>
                        <div className="space-y-2 mt-2">
                          <Row label="Product" value={order.product} />
                          <Row label="Quantity" value={order.qty} />
                          {!isBuyer && <Row label="Buyer" value={order.buyer} />}
                          <Row label="Certification" value={order.certificationMatch} />
                        </div>
                      </section>

                      {/* Production Progress */}
                      <section className="border-t border-slate-800 pt-4">
                        <SectionLabel>Production Progress</SectionLabel>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Completed</span>
                            <span className="font-mono font-bold text-slate-300">{order.prodProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${order.risk > 60 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`}
                              style={{ width: `${order.prodProgress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </section>

                      {/* Inventory */}
                      <section className="border-t border-slate-800 pt-4">
                        <SectionLabel>Inventory</SectionLabel>
                        <div className="mt-3 space-y-2">
                          <Row label="In Storage" value={order.inventoryIn} highlight />
                          <Row label="Remaining Needed" value={order.inventoryRemaining} />
                          <Row label="Alternate Capacity" value={order.alternateCap} small />
                        </div>
                        {/* Visual inventory bar */}
                        <div className="mt-3">
                          <div className="flex text-[10px] text-slate-500 mb-1 justify-between">
                            <span>Storage vs. Needed</span>
                          </div>
                          <div className="flex rounded-full overflow-hidden h-2 bg-slate-800">
                            <div
                              className="bg-emerald-500 h-full"
                              style={{ width: `${Math.round(parseInt(order.inventoryIn.replace(/,/g, '')) / parseInt(order.qty.replace(/,/g, '')) * 100)}%` }}
                            />
                            <div
                              className="bg-red-500/60 h-full"
                              style={{ width: `${Math.round(parseInt(order.inventoryRemaining.replace(/,/g, '')) / parseInt(order.qty.replace(/,/g, '')) * 100)}%` }}
                            />
                          </div>
                          <div className="flex gap-3 mt-1.5 text-[10px]">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> In storage</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/60 inline-block"></span> Still needed</span>
                          </div>
                        </div>
                      </section>

                      {/* Risk & Timing */}
                      <section className="border-t border-slate-800 pt-4">
                        <SectionLabel>Risk & Timing</SectionLabel>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">Risk Score</span>
                            <ExplainableRiskScore score={order.risk} type="Order" />
                          </div>
                          <Row label="Deadline" value={order.deadline} />
                          <Row label="Expected Delay" value={order.delay} highlight />
                        </div>
                      </section>

                      {/* Recommended Recovery */}
                      <section className="border-t border-slate-800 pt-4">
                        <SectionLabel>Recommended Recovery</SectionLabel>
                        <div className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                          <p className="text-sm text-indigo-300 font-medium leading-relaxed">{order.recovery}</p>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">{children}</span>
  );
}

function Row({ label, value, highlight, small }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className={`${small ? 'text-[11px]' : 'text-xs'} text-slate-500 font-medium shrink-0`}>{label}</span>
      <span className={`${small ? 'text-[11px]' : 'text-sm'} font-medium text-right ${highlight ? 'text-amber-400' : 'text-slate-300'}`}>{value}</span>
    </div>
  );
}
