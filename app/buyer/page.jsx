"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/command-center/Sidebar";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";
import {
  BUYER_PROFILE,
  BUYER_SUMMARY,
  BUYER_ORDERS,
  BUYER_STATUS,
} from "@/lib/buyerData";
import {
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  X,
  Bell,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const STATUS_STYLES = {
  ON_TRACK:      { bg: "bg-emerald-50",   border: "border-emerald-200", text: "text-emerald-700",  dot: "bg-emerald-500" },
  AT_RISK:       { bg: "bg-red-50",       border: "border-red-200",     text: "text-red-700",      dot: "bg-red-500"     },
  DELAYED:       { bg: "bg-amber-50",     border: "border-amber-200",   text: "text-amber-700",    dot: "bg-amber-500"   },
  DECISION_REQD: { bg: "bg-blue-50",      border: "border-blue-200",    text: "text-blue-700",     dot: "bg-blue-500"    },
  SECURED:       { bg: "bg-emerald-50",   border: "border-emerald-200", text: "text-emerald-700",  dot: "bg-emerald-500" },
};

const TIMELINE_STYLES = {
  info:    { dot: "bg-slate-400",    line: "border-slate-200" },
  alert:   { dot: "bg-amber-500",    line: "border-amber-200" },
  action:  { dot: "bg-blue-500",     line: "border-blue-200"  },
  pending: { dot: "bg-slate-300 animate-pulse", line: "border-slate-100" },
};

export default function BuyerDashboard() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedTimeline, setExpandedTimeline] = useState({});

  const order = BUYER_ORDERS.find((o) => o.id === selectedOrder);

  const toggleTimeline = (id) =>
    setExpandedTimeline((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-body">
      <Sidebar />

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
              {BUYER_PROFILE.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight">{BUYER_PROFILE.name}</div>
              <div className="text-xs text-slate-500">{BUYER_PROFILE.company}</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Decision required alert */}
            {BUYER_SUMMARY.decisionsRequired > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                <Bell className="h-3.5 w-3.5" />
                {BUYER_SUMMARY.decisionsRequired} Decision Required
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Buyer-secured view
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-[1200px] mx-auto space-y-6">

            {/* Page Title */}
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
              <p className="text-sm text-slate-500 mt-0.5">Real-time status of your active orders and fulfillment outlook</p>
            </div>

            {/* Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SummaryCard
                label="Active Orders"
                value={BUYER_SUMMARY.activeOrders}
                icon={<Package className="h-4 w-4" />}
                color="blue"
              />
              <SummaryCard
                label="Orders at Risk"
                value={BUYER_SUMMARY.ordersAtRisk}
                icon={<AlertTriangle className="h-4 w-4" />}
                color="red"
              />
              <SummaryCard
                label="Decisions Required"
                value={BUYER_SUMMARY.decisionsRequired}
                icon={<Bell className="h-4 w-4" />}
                color="blue"
                pulse
              />
              <SummaryCard
                label="Expected Delays"
                value={BUYER_SUMMARY.expectedDelays}
                icon={<Clock className="h-4 w-4" />}
                color="amber"
              />
            </div>

            {/* Main content: Order List + Inspector */}
            <div className={`grid gap-6 items-start ${selectedOrder ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1"}`}>

              {/* Order List */}
              <div className={`space-y-4 ${selectedOrder ? "lg:col-span-3" : ""}`}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Order Overview
                </h2>

                {BUYER_ORDERS.map((o) => {
                  const st = STATUS_STYLES[o.status] || STATUS_STYLES.ON_TRACK;
                  const statusMeta = BUYER_STATUS[o.status];
                  const isSelected = selectedOrder === o.id;
                  const timelineOpen = expandedTimeline[o.id];

                  return (
                    <div
                      key={o.id}
                      className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
                        isSelected ? "border-blue-300 ring-1 ring-blue-200 shadow-md" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Notification Banner */}
                      {o.notificationType && (
                        <div className={`px-5 py-2.5 flex items-center gap-2 text-xs font-bold border-b ${
                          o.status === "AT_RISK"
                            ? "bg-red-50 border-red-100 text-red-700"
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          {o.notificationType}
                          <span className="font-normal text-slate-500 ml-1">— {o.notificationMessage}</span>
                        </div>
                      )}

                      {/* Order Header Row */}
                      <div
                        className="px-5 py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                        onClick={() => setSelectedOrder(isSelected ? null : o.id)}
                      >
                        {/* Status dot */}
                        <div className="mt-1 shrink-0">
                          <div className={`w-2.5 h-2.5 rounded-full ${st.dot}`} />
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-base font-bold font-mono text-slate-900">{o.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${st.bg} ${st.border} ${st.text}`}>
                              {statusMeta?.label}
                            </span>
                            {o.decisionRequired && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 uppercase tracking-wider flex items-center gap-1">
                                <Bell className="h-2.5 w-2.5" /> Action Required
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
                            <span className="font-medium text-slate-700">{o.product}</span>
                            <span>{o.quantity}</span>
                          </div>
                        </div>

                        {/* ETA + Risk */}
                        <div className="flex items-center gap-8 shrink-0">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Original ETA</div>
                            <div className="text-sm font-mono text-slate-600 line-through decoration-slate-400">{o.originalETA}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Updated ETA</div>
                            <div className={`text-sm font-mono font-bold ${o.status === "AT_RISK" ? "text-red-600" : "text-amber-600"}`}>
                              {o.updatedETA}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Risk</div>
                            <ExplainableRiskScore score={o.risk} type="Order" />
                          </div>
                          <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                        </div>
                      </div>

                      {/* Recovery options row (if decision required) */}
                      {o.decisionRequired && o.recoveryOptions.length > 0 && (
                        <div className="px-5 pb-4 border-t border-slate-100 pt-4 bg-blue-50/30">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                            Available Recovery Options
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {o.recoveryOptions.map((opt) => (
                              <div
                                key={opt.id}
                                className={`p-3 rounded-xl border text-xs ${
                                  opt.recommended
                                    ? "bg-emerald-50 border-emerald-200"
                                    : "bg-white border-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                                  {opt.recommended && <Sparkles className="h-3 w-3 text-emerald-500" />}
                                  {opt.label}
                                  {opt.recommended && (
                                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-100 px-1.5 rounded-full">Recommended</span>
                                  )}
                                </div>
                                <div className="text-slate-500">{opt.impact}</div>
                                <div className="text-slate-400 mt-0.5">{opt.costImpact}</div>
                              </div>
                            ))}
                          </div>
                          <Link
                            href="/recovery"
                            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            View full scenario comparison
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}

                      {/* Collapsible Timeline */}
                      <button
                        onClick={() => toggleTimeline(o.id)}
                        className="w-full px-5 py-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${timelineOpen ? "rotate-180" : ""}`} />
                        {timelineOpen ? "Hide" : "Show"} Order Timeline
                      </button>

                      {timelineOpen && (
                        <div className="px-5 pb-4 bg-slate-50/50">
                          <div className="relative mt-2 pl-4">
                            {o.timeline.map((event, idx) => {
                              const ts = TIMELINE_STYLES[event.type];
                              return (
                                <div key={idx} className="relative flex gap-3 mb-3 last:mb-0">
                                  <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${ts.dot}`} />
                                  {idx < o.timeline.length - 1 && (
                                    <div className={`absolute left-0.5 top-3.5 w-px h-full border-l-2 border-dashed ${ts.line}`} />
                                  )}
                                  <div className="pl-4">
                                    <div className="text-[10px] text-slate-400 font-mono">{event.time}</div>
                                    <div className="text-xs text-slate-700 font-medium mt-0.5">{event.event}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order Inspector */}
              {selectedOrder && order && (
                <div className="lg:col-span-2">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden sticky top-0">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
                      <div>
                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Order Details</div>
                        <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{order.id}</div>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-5 space-y-5">
                      {/* Order Profile */}
                      <section>
                        <Label>Order Profile</Label>
                        <div className="mt-2 space-y-2">
                          <Row label="Product" value={order.product} />
                          <Row label="Quantity" value={order.quantity} />
                          <Row label="Confidence" value={`${order.confidence}%`} />
                        </div>
                      </section>

                      {/* ETA Details */}
                      <section className="border-t border-slate-100 pt-4">
                        <Label>Delivery Timeline</Label>
                        <div className="mt-3 flex gap-3">
                          <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Original ETA</div>
                            <div className="text-sm font-bold text-slate-500 line-through">{order.originalETA}</div>
                          </div>
                          <div className="flex items-center text-slate-300">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                          <div className={`flex-1 p-3 rounded-xl border text-center ${
                            order.status === "AT_RISK" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                          }`}>
                            <div className={`text-[10px] uppercase font-bold mb-1 ${
                              order.status === "AT_RISK" ? "text-red-400" : "text-amber-400"
                            }`}>Updated ETA</div>
                            <div className={`text-sm font-bold ${
                              order.status === "AT_RISK" ? "text-red-700" : "text-amber-700"
                            }`}>{order.updatedETA}</div>
                          </div>
                        </div>
                        <div className={`mt-2 text-center text-xs font-bold py-1 rounded-lg ${
                          order.status === "AT_RISK" ? "text-red-600 bg-red-50" : "text-amber-600 bg-amber-50"
                        }`}>
                          Expected shift: {order.etaShift}
                        </div>
                      </section>

                      {/* Risk */}
                      <section className="border-t border-slate-100 pt-4">
                        <Label>Risk Assessment</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Risk Score</span>
                            <ExplainableRiskScore score={order.risk} type="Order" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">AI Confidence</span>
                            <span className="text-sm font-bold text-slate-700">{order.confidence}%</span>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                            {order.notificationMessage}
                          </div>
                        </div>
                      </section>

                      {/* Status */}
                      <section className="border-t border-slate-100 pt-4">
                        <Label>Current Status</Label>
                        <div className="mt-2">
                          {(() => {
                            const st = STATUS_STYLES[order.status];
                            const statusMeta = BUYER_STATUS[order.status];
                            return (
                              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${st.bg} ${st.border}`}>
                                <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                                <span className={`text-sm font-bold ${st.text}`}>{statusMeta?.label}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </section>

                      {/* Recommended Recovery */}
                      {order.decisionRequired && (
                        <section className="border-t border-slate-100 pt-4">
                          <Label>Recommended Recovery</Label>
                          <div className="mt-2 space-y-2">
                            {order.recoveryOptions.filter(o => o.recommended).map((opt) => (
                              <div key={opt.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                                <div className="font-bold text-emerald-700 flex items-center gap-1 mb-1">
                                  <Sparkles className="h-3 w-3" /> {opt.label}
                                </div>
                                <div className="text-emerald-600">{opt.impact}</div>
                              </div>
                            ))}
                            <Link
                              href="/recovery"
                              className="block text-center py-2.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                            >
                              View all recovery options →
                            </Link>
                          </div>
                        </section>
                      )}
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

function SummaryCard({ label, value, icon, color, pulse }) {
  const colors = {
    blue:  { bg: "bg-blue-50",   border: "border-blue-100",  icon: "text-blue-500",   val: "text-blue-700"   },
    red:   { bg: "bg-red-50",    border: "border-red-100",   icon: "text-red-500",    val: "text-red-700"    },
    amber: { bg: "bg-amber-50",  border: "border-amber-100", icon: "text-amber-500",  val: "text-amber-700"  },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
      <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 ${c.icon}`}>
        {pulse && (
          <span className="relative flex h-2 w-2 mr-0.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${c.icon.replace("text-", "bg-")}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${c.icon.replace("text-", "bg-")}`}></span>
          </span>
        )}
        {icon}{label}
      </div>
      <div className={`text-3xl font-extrabold tracking-tight ${c.val}`}>{value}</div>
    </div>
  );
}

function Label({ children }) {
  return <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{children}</span>;
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}
