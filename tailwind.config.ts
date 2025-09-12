import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1F2937",
        sand: "#F7F2EA",
        deep: "#0E3B2E",
        gold: "#E8C547",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-bebas)"],
        alt: ["var(--font-outfit)"], // optional
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;