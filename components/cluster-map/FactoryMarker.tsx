"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FactoryMarker — Leaflet divIcon creators for factory markers + cluster labels
// ─────────────────────────────────────────────────────────────────────────────
// Called client-side only (ClusterMap is dynamically imported with ssr:false).
// Returns L.DivIcon instances used by react-leaflet's <Marker> component.
// ─────────────────────────────────────────────────────────────────────────────

import L from "leaflet";

// ── Status → border color ─────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { border: string }> = {
  OPERATIONAL: { border: "#16a34a" },
  WARNING:     { border: "#d97706" },
  DOWN:        { border: "#dc2626" },
};

// ── Factory type → inline SVG path (16×16 viewBox) ───────────────────────────
// Uses currentColor for stroke/fill so the parent div's CSS color is inherited.

const FACTORY_SVG: Record<string, string> = {
  Spinning: `
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.8" fill="none"/>
    <circle cx="8" cy="8" r="1.8" fill="currentColor"/>
    <line x1="8" y1="2.5" x2="8" y2="4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="8" y1="11.5" x2="8" y2="13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="2.5" y1="8" x2="4.5" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="11.5" y1="8" x2="13.5" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,
  Weaving: `
    <rect x="2" y="2" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.9"/>
    <rect x="9" y="2" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="2" y="9" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="9" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.9"/>
  `,
  Knitting: `
    <path d="M2 5.5c1 0 1 2.5 2.5 2.5S6.5 5.5 7.5 5.5 9.5 8 11 8 13 5.5 14 5.5"
      stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M2 10c1 0 1 2 2.5 2S6.5 10 7.5 10 9.5 12 11 12 13 10 14 10"
      stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  `,
  Dyeing: `<path d="M8 2L5 9a3.5 3.5 0 0 0 6 0L8 2z" fill="currentColor" opacity="0.85"/>`,
  Printing: `
    <rect x="3" y="5.5" width="10" height="6" rx="1" stroke="currentColor" stroke-width="1.6" fill="none"/>
    <path d="M5.5 8.5h5M5.5 10.5h3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <rect x="5.5" y="2.5" width="5" height="3" rx="0.5" stroke="currentColor" stroke-width="1.4" fill="none"/>
  `,
  Finishing: `
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="3.5" cy="3.5" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="12.5" cy="12.5" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
  `,
  Garmenting: `
    <path d="M6 2.5H5L2.5 5.5l2.5 1.5v7h7v-7l2.5-1.5L12 2.5h-1L9 4.5H7L6 2.5z"
      stroke="currentColor" stroke-width="1.4" fill="none"
      stroke-linejoin="round" stroke-linecap="round"/>
  `,
};

// ── Factory marker ────────────────────────────────────────────────────────────

interface Factory {
  id: string;
  type: string;
  status: string;
}

export function createFactoryIcon(factory: Factory, isSelected: boolean, isRecoveryOrigin = false): L.DivIcon {
  const colors = STATUS_COLORS[factory.status] ?? STATUS_COLORS.OPERATIONAL;
  const svgPaths = FACTORY_SVG[factory.type] ?? FACTORY_SVG.Spinning;
  const size = isSelected || isRecoveryOrigin ? 36 : 30;
  const iconPx = isSelected || isRecoveryOrigin ? 14 : 12;

  let pingRing = factory.status === "DOWN"
    ? `<div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #dc2626;animation:ping 1.5s ease-in-out infinite;opacity:0.55;pointer-events:none;"></div>`
    : "";

  if (isRecoveryOrigin) {
    pingRing = `<div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #10b981;animation:ping 2s ease-in-out infinite;opacity:0.6;pointer-events:none;"></div>`;
  }

  let shadow = isSelected || isRecoveryOrigin
    ? `0 0 0 3px ${isRecoveryOrigin ? '#10b981' : colors.border}30, 0 2px 8px rgba(0,0,0,0.2)`
    : "0 1px 5px rgba(0,0,0,0.18)";

  const html = `
<div style="position:relative;width:${size}px;height:${size}px;">
  ${isRecoveryOrigin ? `<div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:#022c22;color:#34d399;font-size:9px;font-weight:bold;padding:2px 6px;border-radius:4px;white-space:nowrap;border:1px solid #059669;box-shadow:0 2px 4px rgba(0,0,0,0.2);z-index:10;pointer-events:none;">ORDER ORIGIN</div>` : ''}
  ${pingRing}
  <div style="
    width:${size}px;height:${size}px;border-radius:50%;
    background:white;border:2px solid ${isRecoveryOrigin ? '#10b981' : colors.border};
    box-shadow:${shadow};
    display:flex;align-items:center;justify-content:center;
    position:relative;z-index:1;cursor:pointer;
    color:${isRecoveryOrigin ? '#10b981' : colors.border};
  ">
    <svg width="${iconPx}" height="${iconPx}" viewBox="0 0 16 16" style="overflow:visible;">
      ${svgPaths}
    </svg>
  </div>
</div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 10)],
  });
}

// ── Cluster label marker ──────────────────────────────────────────────────────

export function createClusterLabelIcon(name: string): L.DivIcon {
  const html = `
<div style="
  display:inline-block;
  background:white;
  border:1.5px solid #bbf7d0;
  color:#166534;
  font-family:Inter,system-ui,sans-serif;
  font-size:11px;font-weight:700;
  padding:3px 10px;
  border-radius:20px;
  white-space:nowrap;
  box-shadow:0 1px 5px rgba(0,0,0,0.12);
  transform:translateX(-50%);
  letter-spacing:0.01em;
  cursor:pointer;
">${name}</div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -8],
  });
}
