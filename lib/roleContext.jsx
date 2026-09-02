"use client";

/**
 * RoleContext — Single source of truth for role-based access control.
 *
 * Two roles: "owner" | "buyer"
 *
 * Provides:
 *   role          — current active role
 *   setRole       — change role
 *   activeNav     — nav items for current role
 *   isAllowed(p)  — true if pathname p is accessible in current role
 *
 * DATA ISOLATION CONTRACT:
 *   Owner components receive internal operational data.
 *   Buyer components receive ONLY buyer-safe data from buyerData.js.
 *   This file enforces which routes are accessible — it never passes data.
 */

import React, { createContext, useContext, useState } from "react";

// ─── Route definitions ────────────────────────────────────────────────────────

export const OWNER_ROUTES = [
  "/command-center",
  "/factory-owner",
  "/my-network",
  "/global-logistics",
  "/investigation",
  "/impact",
  "/recovery",
  "/false-diversification",
  "/decisions-audit",
];

export const BUYER_ROUTES = [
  "/buyer",
  "/buyer-recovery",
  "/buyer-decision",
  "/impact",
  "/cluster-map",
];

// ─── Navigation items ─────────────────────────────────────────────────────────

export const OWNER_NAV = [
  { id: "nav-cc",         label: "Command Center",       href: "/command-center",       iconName: "LayoutDashboard" },
  { id: "nav-factory",    label: "Factory Dashboard",    href: "/factory-owner",        iconName: "Factory"         },
  { id: "nav-network",    label: "My Network",           href: "/my-network",           iconName: "Network"         },
  { id: "nav-logistics",  label: "Global Logistics",     href: "/global-logistics",     iconName: "Network"         },
  { id: "nav-inv",        label: "Investigation",        href: "/investigation",        iconName: "Search"          },
  { id: "nav-impact",     label: "Impact & Inventory",   href: "/impact",               iconName: "BarChart2"       },
  { id: "nav-recovery",   label: "Recovery Scenarios",   href: "/recovery",             iconName: "RefreshCcw"      },
  { id: "nav-false-div",  label: "False Diversification",href: "/false-diversification",iconName: "GitMerge"        },
  { id: "nav-audit",      label: "Decisions & Audit",    href: "/decisions-audit",      iconName: "ClipboardList"   },
];

export const BUYER_NAV = [
  { id: "nav-b-orders",   label: "My Orders",            href: "/buyer",                iconName: "ShoppingBag"     },
  { id: "nav-b-impact",   label: "Impact & Inventory",   href: "/impact",               iconName: "BarChart2"       },
  { id: "nav-b-recovery", label: "Recovery Options",     href: "/buyer-recovery",       iconName: "RefreshCcw"      },
  { id: "nav-b-decision", label: "Decision Center",      href: "/buyer-decision",       iconName: "ClipboardList"   },
  { id: "nav-b-map",      label: "Cluster Map",          href: "/cluster-map",          iconName: "Map"             },
];

// ─── Personas ─────────────────────────────────────────────────────────────────

export const PERSONAS = {
  owner: {
    name:    "Suresh",
    full:    "Suresh Textiles",
    role:    "Factory Owner",
    location:"Tiruppur, Tamil Nadu",
    initials:"ST",
    color:   "#6366f1", // indigo
  },
  buyer: {
    name:    "Anika",
    full:    "Zara Sourcing (EU)",
    role:    "Buyer",
    location:"Europe",
    initials:"AS",
    color:   "#0ea5e9", // sky
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isRouteAllowed(role, pathname) {
  const routes = role === "owner" ? OWNER_ROUTES : BUYER_ROUTES;
  return routes.some(r => pathname === r || pathname.startsWith(r + "/"));
}

export function getHomeRoute(role) {
  return role === "owner" ? "/command-center" : "/buyer";
}

export function getActiveNav(role) {
  return role === "owner" ? OWNER_NAV : BUYER_NAV;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState("owner"); // default: factory owner

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within <RoleProvider>");
  return ctx;
}
