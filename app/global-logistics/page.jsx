"use client";

import React from "react";
import { Sidebar } from "@/components/command-center/Sidebar";
import { GlobalDisruptionCenter } from "@/components/global-disruption/GlobalDisruptionCenter";
import { RoleGuard } from "@/components/ui/RoleGuard";
import { Bell, Ship, Globe, CloudLightning, ShieldAlert, XCircle } from "lucide-react";
import { useDisruption } from "@/lib/disruptionContext";

export default function GlobalLogisticsPage() {
  const { activeDisruption, triggerShipmentDisruption, resetDisruption } = useDisruption();

  return (
    <RoleGuard allowedRole="owner">
      <div className="flex h-screen overflow-hidden bg-slate-50 font-body">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Minimal Header with Simulation Controls */}
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0">
            <div className="flex-1 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Simulate:</span>
              
              <button 
                onClick={() => triggerShipmentDisruption('PORT_CONGESTION')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeDisruption?.type === 'PORT_CONGESTION' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'} border`}
              >
                <Ship className="w-3.5 h-3.5" /> Port Congestion
              </button>
              
              <button 
                onClick={() => triggerShipmentDisruption('GEOPOLITICAL_EVENT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeDisruption?.type === 'GEOPOLITICAL_EVENT' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'} border`}
              >
                <Globe className="w-3.5 h-3.5" /> Suez Blockage
              </button>
              
              <button 
                onClick={() => triggerShipmentDisruption('WEATHER_DISRUPTION')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeDisruption?.type === 'WEATHER_DISRUPTION' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'} border`}
              >
                <CloudLightning className="w-3.5 h-3.5" /> Typhoon Warning
              </button>

              <button 
                onClick={() => triggerShipmentDisruption('PORT_STRIKE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeDisruption?.type === 'PORT_STRIKE' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'} border`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Port Strike
              </button>

              {activeDisruption && activeDisruption.category === "SHIPMENT" && (
                <button 
                  onClick={resetDisruption}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-red-600 hover:bg-red-50 transition-colors ml-2"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-slate-500">
                  Global Operations
                </span>
                <div className="h-4 w-px bg-slate-200"></div>
                <span className="text-[12px] font-bold text-slate-700">Factory Owner View</span>
              </div>
              <button className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                <div className="text-right">
                  <div className="text-[13px] font-bold text-slate-900 leading-tight">Suresh</div>
                  <div className="text-[11px] text-slate-500">Suresh Textiles Pvt. Ltd.</div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-[13px] font-bold text-white shadow-sm">
                  ST
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            <GlobalDisruptionCenter />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}