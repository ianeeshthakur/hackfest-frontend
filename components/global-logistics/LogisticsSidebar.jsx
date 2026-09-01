"use client";

import React from "react";
import Link from "next/link";
import { Hexagon, Activity, LayoutDashboard, Route, Globe, Factory, BarChart2, Lightbulb, User } from "lucide-react";

export function LogisticsSidebar() {
  return (
    <div className="w-64 bg-[#0f172a] h-screen flex flex-col text-slate-300 border-r border-slate-800 flex-shrink-0 relative z-20 font-sans">
      {/* Top Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <Hexagon className="h-6 w-6 text-teal-500 fill-teal-500/20" />
          <span>SetuTrace</span>
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">
          Resilience OS
        </div>
      </div>

      {/* Demo Env Badge */}
      <div className="px-6 py-4">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
          Demo Environment
        </div>
        <div className="text-sm font-medium text-slate-300 leading-tight">
          Factory A &middot; Tiruppur<br/>
          <span className="text-teal-400">Order #4521</span> &middot; live simulation
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6">
        
        {/* OPERATE */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">
            Operate
          </div>
          <div className="flex flex-col gap-1">
            <NavItem icon={<Activity className="w-4 h-4" />} label="Control tower" />
            <NavItem icon={<Factory className="w-4 h-4" />} label="Local production" />
            <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="AI command center" />
            <NavItem icon={<Route className="w-4 h-4" />} label="Order journey" />
            <NavItem icon={<Globe className="w-4 h-4" />} label="Global logistics" active />
          </div>
        </div>

        {/* PERSPECTIVES */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">
            Perspectives
          </div>
          <div className="flex flex-col gap-1">
            <NavItem icon={<BarChart2 className="w-4 h-4" />} label="Owner dashboard" />
            <NavItem icon={<User className="w-4 h-4" />} label="Buyer-safe view" />
            <NavItem icon={<Lightbulb className="w-4 h-4" />} label="Simulations" />
          </div>
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
            SP
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Suresh Patel</div>
            <div className="text-xs text-slate-400 truncate">Owner &middot; Factory A</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <Link
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-amber-500/10 text-amber-500 font-semibold"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
      )}
    </Link>
  );
}
