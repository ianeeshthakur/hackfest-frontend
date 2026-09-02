"use client";

/**
 * RoleSwitcher
 *
 * Fixed floating widget, bottom-right on every page.
 * Shows active role persona and a one-click switch button.
 * On switch: updates global role and redirects to correct home.
 *
 * DESIGN: Works on both dark (investigation, factory) and light (buyer, CC) pages.
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole, getHomeRoute, PERSONAS } from "@/lib/roleContext";
import { Factory, User, ArrowLeftRight, ChevronUp, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const current = PERSONAS[role];
  const other = role === "owner" ? "buyer" : "owner";
  const otherPersona = PERSONAS[other];

  const switchRole = () => {
    setRole(other);
    router.replace(getHomeRoute(other));
    setExpanded(false);
  };

  const isOwner = role === "owner";
  const accent = isOwner ? "#6366f1" : "#0ea5e9";
  const accentMuted = isOwner ? "rgba(99,102,241,0.12)" : "rgba(14,165,233,0.12)";
  const accentBorder = isOwner ? "rgba(99,102,241,0.3)" : "rgba(14,165,233,0.3)";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 232, // just to the right of the sidebar
        zIndex: 9000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
      }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            marginBottom: 8,
            background: "rgba(10,14,25,0.96)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "12px 14px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            minWidth: 200,
            animation: "roleExpand 0.15s ease-out",
          }}
        >
          <style>{`@keyframes roleExpand { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>

          <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Switch Role
          </div>

          {/* Switch to other role */}
          <button
            onClick={switchRole}
            style={{
              width: "100%", textAlign: "left", padding: "10px 12px",
              borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              background: role === "owner" ? "rgba(14,165,233,0.08)" : "rgba(99,102,241,0.08)",
              border: `1px solid ${role === "owner" ? "rgba(14,165,233,0.2)" : "rgba(99,102,241,0.2)"}`,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 7, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: role === "owner" ? "rgba(14,165,233,0.15)" : "rgba(99,102,241,0.15)",
              border: `1px solid ${role === "owner" ? "rgba(14,165,233,0.3)" : "rgba(99,102,241,0.3)"}`,
            }}>
              {role === "owner"
                ? <User style={{ width: 13, height: 13, color: "#38bdf8" }} />
                : <Factory style={{ width: 13, height: 13, color: "#818cf8" }} />
              }
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", lineHeight: 1 }}>
                Switch to {otherPersona.role}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                {otherPersona.full}
              </div>
            </div>
          </button>

          {/* Current role indicator */}
          <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 9, color: "#475569", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Currently viewing as
            </div>
            <div style={{ fontSize: 11, color: accent, fontWeight: 700, marginTop: 2 }}>
              {current.role} — {current.full}
            </div>
          </div>
        </div>
      )}

      {/* Pill button */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 12px", borderRadius: 10, cursor: "pointer",
          background: "rgba(10,14,25,0.92)",
          border: `1px solid ${accentBorder}`,
          backdropFilter: "blur(16px)",
          boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${accentBorder}`,
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accentBorder}`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${accentBorder}`; }}
      >
        {/* Avatar */}
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: accentMuted, border: `1px solid ${accentBorder}`,
          fontSize: 9, fontWeight: 800, color: accent, letterSpacing: "-0.01em",
        }}>
          {current.initials}
        </div>

        {/* Name + role */}
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9" }}>{current.name}</div>
          <div style={{ fontSize: 9, color: accent, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 1 }}>
            {current.role}
          </div>
        </div>

        {/* Switch icon */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 2 }}>
          <ArrowLeftRight style={{ width: 11, height: 11, color: "#475569" }} />
          {expanded
            ? <ChevronDown style={{ width: 11, height: 11, color: "#475569" }} />
            : <ChevronUp style={{ width: 11, height: 11, color: "#475569" }} />
          }
        </div>
      </button>
    </div>
  );
}
