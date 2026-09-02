"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { RoleGuard } from "@/components/ui/RoleGuard";
import { Bot, Package, CheckCircle2, Factory, ShieldCheck, AlertTriangle } from "lucide-react";
import { ExplainableRiskScore } from "@/components/ui/ExplainableRiskScore";

const MOCK_BIDS = [
  {
    id: "bid-1",
    factory: "Mehta Textiles",
    location: "Panipat, Haryana",
    availableCapacity: "12,000 m",
    productionTime: 4,
    deliveryDate: "Sep 06",
    additionalCost: 12500,
    qualityMatch: 98,
    risk: 18,
    confidence: 94,
    status: "Available",
    aiRecommended: true,
  },
  {
    id: "bid-2",
    factory: "Krishna Weaves",
    location: "Ludhiana, Punjab",
    availableCapacity: "8,000 m",
    productionTime: 5,
    deliveryDate: "Sep 07",
    additionalCost: 8500,
    qualityMatch: 96,
    risk: 28,
    confidence: 91,
    status: "Partial Capacity",
    aiRecommended: false,
  },
  {
    id: "bid-3",
    factory: "Global Threads",
    location: "Surat, Gujarat",
    availableCapacity: "12,000 m",
    productionTime: 7,
    deliveryDate: "Sep 09",
    additionalCost: 4500,
    qualityMatch: 92,
    risk: 42,
    confidence: 85,
    status: "Available",
    aiRecommended: false,
  },
];

export default function BuyerDecisionCentre() {
  // State Machine: INITIAL -> GENERATING -> RESULTS -> CONFIRMING -> RESERVED
  const [workflowState, setWorkflowState] = useState("INITIAL");
  const [selectedBid, setSelectedBid] = useState(null);
  const [generationStep, setGenerationStep] = useState(0);

  const startBidding = () => {
    setWorkflowState("GENERATING");
    setGenerationStep(0);
    
    // Simulate AI Generation Sequence
    setTimeout(() => setGenerationStep(1), 1500);
    setTimeout(() => setGenerationStep(2), 3000);
    setTimeout(() => setGenerationStep(3), 4500);
    setTimeout(() => setWorkflowState("RESULTS"), 6000);
  };

  const handleSelectFactory = (bid) => {
    setSelectedBid(bid);
    setWorkflowState("CONFIRMING");
  };

  const handleConfirmFactory = () => {
    setWorkflowState("RESERVED");
  };

  const renderAIContext = () => {
    let content = "";
    if (workflowState === "INITIAL") {
      content = "Your order requires 12,000 m of alternate capacity due to a supply disruption.";
    } else if (workflowState === "GENERATING") {
      const steps = [
        "Finding certified alternate factories...",
        "Scanning available capacity...",
        "Checking certifications...",
        "Generating competitive bids..."
      ];
      content = steps[generationStep] || steps[0];
    } else if (workflowState === "RESULTS") {
      content = "3 factory bids are ready for comparison. Mehta Textiles offers the strongest combination of delivery speed, capacity, and fulfillment risk.";
    } else if (workflowState === "CONFIRMING") {
      content = `Review the selected capacity reservation for ${selectedBid?.factory}.`;
    } else if (workflowState === "RESERVED") {
      content = "Order recovery request has been successfully sent to the selected factory.";
    }

    return (
      <div className="bg-[#111826] border border-blue-900/40 rounded-xl p-4 flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg shrink-0 relative">
          <Bot className="w-5 h-5" />
          {workflowState === "GENERATING" && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">ThreadLine AI Copilot</h3>
          <p className="text-sm font-medium text-slate-300 transition-all duration-300 ease-in-out">
            {content}
          </p>
        </div>
      </div>
    );
  };

  return (
    <RoleGuard allowedRole="buyer">
      <div className="flex h-screen bg-[#06090F] text-slate-100 overflow-hidden font-body">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-8 py-8 relative">
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Factory className="w-6 h-6 text-indigo-400" />
                  Decision Centre
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Source alternate capacity through factory bidding
                </p>
              </div>
            </div>

            {renderAIContext()}

            {/* INITIAL STATE */}
            {workflowState === "INITIAL" && (
              <div className="bg-[#0B101A] border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto mt-16 text-center">
                <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Request Alternate Factory Capacity</h2>
                <p className="text-slate-400 text-sm mb-8 px-4">
                  A supply disruption requires sourcing alternate capacity for your pending order.
                </p>

                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 text-left mb-8 grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Order</p>
                    <p className="text-sm font-semibold text-white">TX-2048</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Product</p>
                    <p className="text-sm font-semibold text-white">Cotton Twill</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Quantity Required</p>
                    <p className="text-sm font-semibold text-white">12,000 m</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Current Status</p>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <p className="text-sm font-semibold">Capacity at risk</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startBidding}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center gap-2 mx-auto"
                >
                  <Bot className="w-5 h-5" />
                  Generate Factory Bids
                </button>
              </div>
            )}

            {/* GENERATING STATE */}
            {workflowState === "GENERATING" && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Network Capacity</h3>
                <p className="text-blue-400 text-sm animate-pulse">
                  {generationStep === 0 && "Finding certified alternate factories..."}
                  {generationStep === 1 && "Scanning available capacity..."}
                  {generationStep === 2 && "Checking certifications..."}
                  {generationStep === 3 && "Generating competitive bids..."}
                </p>
              </div>
            )}

            {/* RESULTS STATE */}
            {workflowState === "RESULTS" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white mb-4">Available Factory Bids</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {MOCK_BIDS.map((bid) => (
                    <div 
                      key={bid.id} 
                      className={`relative bg-[#0B101A] border rounded-2xl p-6 flex flex-col
                        ${bid.aiRecommended ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-slate-800'}
                      `}
                    >
                      {bid.aiRecommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-emerald-900/30 flex items-center gap-1.5">
                          <Bot className="w-3 h-3" /> AI Recommended
                        </div>
                      )}

                      <div className="mb-6 mt-2">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-extrabold tracking-tight text-white">{bid.factory}</h3>
                          <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${bid.status === 'Available' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-amber-950/50 text-amber-400 border border-amber-900/50'}`}>
                            {bid.status}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Factory className="w-3.5 h-3.5" /> {bid.location}
                        </p>
                      </div>

                      <div className="space-y-4 mb-8 flex-1">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                          <span className="text-xs text-slate-400 font-medium">Capacity Offered</span>
                          <span className="text-sm font-bold text-slate-200">{bid.availableCapacity}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                          <span className="text-xs text-slate-400 font-medium">Production Time</span>
                          <span className="text-sm font-bold text-slate-200">{bid.productionTime} days</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                          <span className="text-xs text-slate-400 font-medium">Estimated Delivery</span>
                          <span className="text-sm font-bold text-emerald-400">{bid.deliveryDate}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                          <span className="text-xs text-slate-400 font-medium">Additional Cost</span>
                          <span className="text-sm font-bold text-amber-400">+₹{bid.additionalCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                          <span className="text-xs text-slate-400 font-medium">Quality Match</span>
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-bold text-blue-400">{bid.qualityMatch}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 font-medium block mb-2">Fulfillment Risk Score</span>
                          <div className="flex items-center gap-3">
                            <ExplainableRiskScore score={bid.risk} type="Bid" />
                            <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${bid.risk < 25 ? 'bg-emerald-500' : bid.risk < 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                style={{ width: `${bid.risk}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">{bid.confidence}% conf.</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors">
                          View Details
                        </button>
                        <button 
                          onClick={() => handleSelectFactory(bid)}
                          className={`${bid.aiRecommended ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'} font-bold py-2.5 rounded-lg text-xs transition-colors`}
                        >
                          Select Factory
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONFIRMING STATE */}
            {workflowState === "CONFIRMING" && selectedBid && (
              <div className="bg-[#0B101A] border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto mt-16">
                <div className="w-16 h-16 bg-blue-900/20 border border-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white text-center mb-6">Confirm Factory Selection</h2>
                
                <div className="bg-slate-900 rounded-xl p-5 mb-8 border border-slate-800">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Selected Factory</span>
                    <span className="text-base font-bold text-white">{selectedBid.factory}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Allocated Quantity</span>
                    <span className="text-sm font-semibold text-slate-200">12,000 m</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Delivery Date</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedBid.deliveryDate}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Cost Impact</span>
                    <span className="text-sm font-bold text-amber-400">+₹{selectedBid.additionalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Risk Exposure</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedBid.risk} / 100</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setWorkflowState("RESULTS")}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Back to Bids
                  </button>
                  <button 
                    onClick={handleConfirmFactory}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/30"
                  >
                    Confirm Capacity
                  </button>
                </div>
              </div>
            )}

            {/* RESERVED STATE */}
            {workflowState === "RESERVED" && selectedBid && (
              <div className="bg-[#0B101A] border border-emerald-900/50 rounded-2xl p-10 max-w-xl mx-auto mt-16 text-center shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                <div className="w-20 h-20 bg-emerald-900/20 border border-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 px-3 py-1 bg-emerald-950/40 border border-emerald-900/50 rounded-full inline-block">
                  Status: Factory Capacity Reserved
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-3 mt-4">Order Recovery Initiated</h2>
                <p className="text-slate-400 text-sm mb-8 px-4">
                  Your request for 12,000 m of capacity has been confirmed with {selectedBid.factory}. A formal purchase order adjustment is being generated.
                </p>
                
                <button 
                  onClick={() => setWorkflowState("INITIAL")}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-colors text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
