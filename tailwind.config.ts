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
          DEFAULT: "#0ea5e9",
          hover: "#38bdf8",
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
