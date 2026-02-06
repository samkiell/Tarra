import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0FB9B1",
          foreground: "#FFFFFF",
        },
        dark: "#0F172A",
        secondary: "#64748B",
        muted: "#E5E7EB",
        // Mapping existing utilities to brand palette for non-destructive update
        stone: {
          50: "#E5E7EB",
          100: "#E5E7EB",
          200: "#E5E7EB",
          300: "#E5E7EB",
          400: "#64748B",
          500: "#64748B",
          600: "#64748B",
          700: "#0F172A",
          800: "#0F172A",
          900: "#0F172A",
          950: "#0F172A",
        },
        amber: {
          500: "#0FB9B1", // Redirecting warnings to brand teal
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-satoshi)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
