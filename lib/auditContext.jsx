"use client";

/**
 * AuditContext — Global shared audit log
 * 
 * Any component anywhere in the app can call `useAudit().addEntry(entry)` to
 * append a new event.  The Decisions & Audit page subscribes and renders them
 * in real time.  Pure React state — no external store, no API calls.
 */

import React, { createContext, useContext, useState, useCallback } from "react";

// ─── Actor keys ───────────────────────────────────────────────────────────────
export const ACTOR = {
  SYSTEM:  "SYSTEM",
  AI:      "AI",
  FACTORY: "FACTORY",
  BUYER:   "BUYER",
};

// ─── Default seed entries (Case TL-4821 timeline) ────────────────────────────
const SEED_ENTRIES = [
  {
    id: "audit-001",
    time: "21:02",
    isoTime: "2026-09-02T21:02:00+05:30",
    action: "Disruption detected",
    actor: ACTOR.SYSTEM,
    reason: "IoT sensors on 4 machine lines reported zero output for 3 consecutive heartbeats.",
    riskBefore: 12,
    riskAfter: 87,
    status: "CONFIRMED",
  },
  {
    id: "audit-002",
    time: "21:03",
    isoTime: "2026-09-02T21:03:00+05:30",
    action: "Investigation completed",
    actor: ACTOR.AI,
    reason: "Multi-source signal synthesis identified grid power interruption in Sector 4 as root cause (94% confidence).",
    riskBefore: 87,
    riskAfter: 82,
    status: "COMPLETED",
  },
  {
    id: "audit-003",
    time: "21:04",
    isoTime: "2026-09-02T21:04:00+05:30",
    action: "Recovery recommendation generated",
    actor: ACTOR.AI,
    reason: "Tiruppur Cluster selected as optimal reroute — 87% capacity available, matching weaving capability.",
    riskBefore: 82,
    riskAfter: 54,
    status: "COMPLETED",
  },
  {
    id: "audit-004",
    time: "21:05",
    isoTime: "2026-09-02T21:05:00+05:30",
    action: "Buyer decision requested",
    actor: ACTOR.SYSTEM,
    reason: "Order TX-2048 delay risk elevated. Buyer approval required for rerouting to alternate facility.",
    riskBefore: 54,
    riskAfter: 54,
    status: "PENDING",
  },
  {
    id: "audit-005",
    time: "21:07",
    isoTime: "2026-09-02T21:07:00+05:30",
    action: "Reroute approved",
    actor: ACTOR.BUYER,
    reason: "Buyer accepted Option 1 — partial rerouting to Tiruppur Cluster, reducing delay from 9 hrs to ~3 hrs.",
    riskBefore: 54,
    riskAfter: 28,
    status: "APPROVED",
  },
  {
    id: "audit-006",
    time: "21:08",
    isoTime: "2026-09-02T21:08:00+05:30",
    action: "Alternate supplier selected",
    actor: ACTOR.SYSTEM,
    reason: "SuppA-T02 (Tiruppur) engaged via privacy-preserving bid. Capacity confirmed: 12,000 units/day.",
    riskBefore: 28,
    riskAfter: 14,
    status: "ACTIVE",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const AuditContext = createContext(null);

export function AuditProvider({ children }) {
  const [entries, setEntries] = useState(SEED_ENTRIES);

  const addEntry = useCallback((entry) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
    setEntries(prev => [
      ...prev,
      {
        id: `audit-${Date.now()}`,
        time: timeStr,
        isoTime: now.toISOString(),
        status: "LOGGED",
        riskBefore: null,
        riskAfter: null,
        reason: "",
        ...entry,
      },
    ]);
  }, []);

  return (
    <AuditContext.Provider value={{ entries, addEntry }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used within <AuditProvider>");
  return ctx;
}
