import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1E2A44",
          deep: "#131C2E",
        },
        paper: {
          DEFAULT: "#F7F5F1",
          raised: "#EFEBE3",
        },
        line: "#DDD7CB",
        text: {
          DEFAULT: "#20242B",
          muted: "#5B6472",
        },
        gold: {
          DEFAULT: "#C9973A",
          dim: "#A97F30",
        },
        live: "#2F6F5E",
        offline: "#9AA0A6",
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
