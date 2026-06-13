import type { Config } from "tailwindcss";

/**
 * Design System do MedCare
 * Identidade premium / minimalista (estilo Linear · Vercel).
 * Tokens espelham o sistema real para que os mockups da landing page
 * sejam visualmente idênticos ao produto.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal
        primary: {
          DEFAULT: "#4578FF",
          soft: "#E8F0FF", // fundo dos stat cards azuis
          foreground: "#FFFFFF",
        },
        teal: {
          DEFAULT: "#00C2C7",
          soft: "#E0F8FC",
        },
        purple: {
          DEFAULT: "#A033FF",
          soft: "#F5E8FF",
        },
        amber: {
          DEFAULT: "#FF9E00",
          soft: "#FFECCC",
        },
        destructive: {
          DEFAULT: "#EF4444",
          soft: "#FEE2E2",
        },
        // Superfícies
        canvas: "#F8FAFC", // Background geral da aplicação
        card: "#FFFFFF",
        muted: "#94A3B8", // Textos secundários
        ink: "#0F172A", // Texto principal (slate-900)
      },
      borderRadius: {
        card: "36px",
        panel: "40px",
      },
      boxShadow: {
        // Sombras ultraleves do design system
        soft: "0 4px 20px rgba(15, 23, 42, 0.02)",
        float: "0 18px 50px -12px rgba(15, 23, 42, 0.12)",
        glow: "0 0 0 1px rgba(69, 120, 255, 0.08), 0 20px 60px -20px rgba(69, 120, 255, 0.35)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.6" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
