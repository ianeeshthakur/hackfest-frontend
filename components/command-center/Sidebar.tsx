"use client";

import React from "react";
import { ThreadlineAssistant } from "@/components/ui/ThreadlineAssistant";
import { useRole, getActiveNav } from "@/lib/roleContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Factory,
  Network,
  AlertTriangle,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Settings,
  Zap,
  Map,
  ClipboardList,
  Search,
  BarChart2,
  RefreshCcw,
  GitMerge,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Factory,
  Network,
  AlertTriangle,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Settings,
  Map,
  ClipboardList,
  Search,
  BarChart2,
  RefreshCcw,
  GitMerge,
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const navItems = getActiveNav(role) as Array<{ id: string, label: string, href: string, iconName: string, badge?: string }>;

  return (
    <aside className="flex h-screen w-[220px] flex-shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Zap className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <span className="font-display text-[15px] font-bold tracking-tight text-slate-900">
            TextileMesh
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight text-blue-600">
            {" "}AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = iconMap[item.iconName] || LayoutDashboard;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-100 px-1.5 text-[11px] font-semibold text-red-600">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-3 space-y-3">
        {/* ThreadLine AI Assistant trigger */}
        <ThreadlineAssistant />
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-slate-500">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
