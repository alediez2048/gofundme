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
        brand: {
          DEFAULT: "#4A9D44",
          strong: "#274A34",
          hover: "#2D6339",
          lime: "#CCF88E",
          subtle: "#E9FCCE",
          darkest: "#0B291A",
          mint: "#F0FCE9",
        },
        primary: {
          DEFAULT: "#274A34",
          foreground: "#CCF88E",
        },
        accent: {
          DEFAULT: "#CCF88E",
          foreground: "#274A34",
        },
        heading: "#232323",
        secondary: "#6F6F6F",
        supporting: "#6F6F6F",
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#FAFAFA",
          extra: "#F5F5F5",
          medium: "#E9E9E9",
          warm: "#FFF3D0",
          dark: "#012D19",
        },
        negative: "#B01509",
        positive: "#2D6339",
        informative: "#185B93",
        warning: "#68570D",
        feature: "#81379B",
        progress: {
          start: "#ACF86C",
          end: "#4A9D44",
        },
        neutral: {
          border: "#D8D8D8",
          "border-strong": "#424242",
          disabled: "#B7B7B6",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "Trebuchet MS", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-fundright-display)", "Georgia", "Times New Roman", "serif"],
      },
      fontSize: {
        "display-lg": ["clamp(3rem, 5vw + 1rem, 5.125rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["clamp(2.5rem, 4vw + 1rem, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["clamp(1.75rem, 3vw + 0.5rem, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-xl": ["clamp(1.75rem, 2vw + 0.5rem, 2rem)", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-lg": ["clamp(1.5rem, 1.5vw + 0.5rem, 1.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-md": ["clamp(1.25rem, 1vw + 0.5rem, 1.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-sm": ["clamp(1rem, 0.5vw + 0.5rem, 1.25rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "heading-xs": ["clamp(0.875rem, 0.25vw + 0.5rem, 1rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "body-lg": ["clamp(1.25rem, 1vw + 0.5rem, 1.5rem)", { lineHeight: "1.5", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        "body-xs": ["0.75rem", { lineHeight: "1.333", fontWeight: "400" }],
      },
      borderRadius: {
        pill: "624.9375rem",
        xxl: "1.25rem",
        xl: "1rem",
        lg: "0.75rem",
        md: "0.5rem",
      },
      boxShadow: {
        soft: "0px 1px 2px rgba(0,0,0,0.1)",
        medium: "0px 2px 6px rgba(0,0,0,0.1)",
        "medium-strong": "0px 4px 8px rgba(0,0,0,0.1)",
        strong: "0px 6px 14px rgba(0,0,0,0.1)",
      },
      maxWidth: {
        content: "75rem",
      },
      spacing: {
        "hrt-1": "0.5rem",
        "hrt-2": "1rem",
        "hrt-3": "1.5rem",
        "hrt-4": "2rem",
        "hrt-5": "2.5rem",
        "hrt-6": "3rem",
        "hrt-7": "3.5rem",
        "hrt-8": "4rem",
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
      transitionTimingFunction: {
        hrt: "cubic-bezier(0.3, 0.01, 0, 1)",
      },
      transitionDuration: {
        hrt: "500ms",
      },
    },
  },
  plugins: [],
};

export default config;
