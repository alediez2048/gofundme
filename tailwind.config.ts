import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#02a95c",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#ffc629",
          foreground: "#1a1a1a",
        },
        heading: "#1a1a1a",
        secondary: "#6b6b6b",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 150ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
