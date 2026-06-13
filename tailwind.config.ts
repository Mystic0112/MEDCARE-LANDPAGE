import type { Config } from "tailwindcss";

/**
 * Design System do MedCare — direção "grife" monocromática.
 * Base preto-e-branco de alto contraste (tokens semânticos em CSS vars,
 * reativos ao tema). As cores da marca (primary/teal/purple/amber) entram
 * estritamente como pontos de luz focais.
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
        // Acentos focais da marca
        primary: {
          DEFAULT: "#4578FF",
          soft: "#E8F0FF",
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
        // Superfícies e texto — tokens semânticos reativos ao tema.
        // Valores em CSS vars (globals.css): claro em :root, escuro em .dark,
        // invertidos em .invert-theme (mockups do produto).
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        // Aliases semânticos do redesign (base monocromática). Apontam direto
        // para --canvas/--ink para re-resolverem por contexto (.invert-theme).
        background: "rgb(var(--canvas) / <alpha-value>)",
        foreground: "rgb(var(--ink) / <alpha-value>)",
        // Banda escura premium — fixa em ambos os temas (não inverte).
        deep: "#0B1120",
      },
      borderRadius: {
        card: "36px",
        panel: "40px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.04)",
        float: "0 18px 50px -12px rgba(0, 0, 0, 0.25)",
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
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
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
