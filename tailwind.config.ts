import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F17",
        panel: "#111826",
        border: "#1F2937",
        teal: {
          DEFAULT: "#2DD4BF",
          muted: "rgba(45, 212, 191, 0.12)",
          hover: "#14b8a6",
          glow: "rgba(45, 212, 191, 0.25)",
        },
        amber: {
          DEFAULT: "#F5A524",
          muted: "rgba(245, 165, 36, 0.12)",
          hover: "#d97706",
          glow: "rgba(245, 165, 36, 0.25)",
        },
        red: {
          DEFAULT: "#F7768E",
          muted: "rgba(247, 118, 142, 0.12)",
          hover: "#e06c75",
          glow: "rgba(247, 118, 142, 0.25)",
        },
        phosphor: {
          DEFAULT: "#4ADE80",
          muted: "rgba(74, 222, 128, 0.12)",
          dim: "#22c55e",
        },
        slate: {
          850: "#151e2e",
          900: "#0f172a",
          950: "#020617",
        }
      },
      fontSize: {
        "xs-label": ["11px", { lineHeight: "14px", letterSpacing: "0.06em" }],
        "sm-body": ["13px", { lineHeight: "18px" }],
        "base-title": ["16px", { lineHeight: "22px" }],
        "2xl-metric": ["26px", { lineHeight: "30px" }],
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.96)" },
        },
        pipelineFlow: {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "pipeline-flow": "pipelineFlow 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
