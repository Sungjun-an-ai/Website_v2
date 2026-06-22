import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef0f8",
          100: "#d5d9ee",
          200: "#aab3dd",
          300: "#7f8dcc",
          400: "#5467bb",
          500: "#2941aa",
          600: "#1B2A6B",
          700: "#152254",
          800: "#0f193d",
          900: "#0a1126",
          DEFAULT: "#1B2A6B",
        },
        gold: {
          DEFAULT: "#D4A843",
          light: "#e8c56e",
          dark: "#b8922a",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Inter", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        scroll: "scroll 26s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scroll: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
