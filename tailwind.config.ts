import type { Config } from "tailwindcss";

// JOMI design system.
// Amber/gold on a white base, with deep navy for hierarchy and accent bands.
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fffbf0",
          100: "#fff2d4",
          200: "#ffe083",
          300: "#ffcb44",
          400: "#f7b22c",
          500: "#ec9d01", // brand
          600: "#c98500",
          700: "#a06a0a",
          800: "#7c520c",
          900: "#5f3f0d",
        },
        navy: {
          50: "#f2f5fa",
          100: "#e2e9f3",
          200: "#c6d3e7",
          300: "#9bb2d3",
          400: "#6a89ba",
          500: "#476aa1",
          600: "#365286",
          700: "#2c426d",
          800: "#22334f",
          900: "#141d2e", // brand accent
          950: "#0b111c",
        },
        ink: {
          50: "#f7f7f6",
          100: "#ebebe9",
          200: "#d8d8d4",
          300: "#b4b4ae",
          400: "#8a8a83",
          500: "#6b6b64",
          600: "#55554f",
          700: "#3f3f3b",
          800: "#1a1a1a", // body text
          900: "#0f0f0f",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#faf9f7", // off-white section background
          sunken: "#f3f1ed",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // One type scale, used everywhere. Fluid between mobile and desktop.
      fontSize: {
        display: ["clamp(2.5rem, 1.5rem + 4vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1: ["clamp(2rem, 1.4rem + 2.6vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["clamp(1.625rem, 1.2rem + 1.7vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.25rem, 1.05rem + 0.8vw, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h4: ["clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem)", { lineHeight: "1.35" }],
        "body-lg": ["clamp(1.125rem, 1.08rem + 0.2vw, 1.25rem)", { lineHeight: "1.65" }],
        body: ["clamp(1rem, 0.97rem + 0.12vw, 1.0625rem)", { lineHeight: "1.7" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6" }],
        caption: ["clamp(0.8125rem, 0.8rem + 0.05vw, 0.875rem)", { lineHeight: "1.5" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 29, 46, 0.04), 0 8px 24px rgba(20, 29, 46, 0.06)",
        lift: "0 12px 32px rgba(20, 29, 46, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
