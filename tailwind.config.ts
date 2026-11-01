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
        background: "#080b11",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "#0e131f",
          hover: "#141b2b",
        },
        secondary: {
          DEFAULT: "#161e30",
        },
        border: "#1e293b",
        accent: {
          DEFAULT: "#2563eb",
          hover: "#3b82f6",
        },
        brand: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          light: "#3b82f6",
          dark: "#1e40af",
        },
        muted: {
          foreground: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
