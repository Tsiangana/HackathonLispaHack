import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        canvas:     "#F8F9FA",
        surface:    "#ffffff",
        surfaceHov: "#f4f4f5",

        // Borders
        border:     "#e4e4e7",
        borderStrong: "#d4d4d8",

        // Text
        textBase:   "#09090b",
        textMuted:  "#52525b",
        textFaint:  "#71717a",

        // Brand accent
        accent:     "#3b82f6",
        accentSoft: "#eff6ff",

        // Status
        ok:       "#10b981",
        okSoft:   "#ecfdf5",
        warn:     "#f59e0b",
        warnSoft: "#fefbeb",
        danger:   "#ef4444",
        dangerSoft:"#fef2f2",
        info:     "#3b82f6",
        infoSoft: "#eff6ff",

        // Node-type chips
        trigger:  "#3b82f6",
        agent:    "#4f46e5",
        condition:"#f59e0b",
        output:   "#10b981",

        // Legacy (kept for 3D scene compatibility)
        panel:    "#ffffff",
        panelSoft:"#f4f4f5",
        line:     "#e4e4e7",
        safety:   "#ef4444",
        caution:  "#f59e0b",
        machine:  "#3b82f6",
      },
      fontFamily: {
        sans: ["Nunito", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
      boxShadow: {
        card:   "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        panel:  "0 4px 24px 0 rgba(0,0,0,0.08)",
        popup:  "0 8px 32px 0 rgba(0,0,0,0.12)",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm:      "5px",
        lg:      "12px",
        xl:      "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;
