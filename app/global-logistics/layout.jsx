import React from "react";
import { LogisticsSidebar } from "@/components/global-logistics/LogisticsSidebar";

export const metadata = {
  title: "Global Logistics | SetuTrace",
  description: "Global Logistics and Shipment Resilience Control Tower",
};

export default function GlobalLogisticsLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      <LogisticsSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
