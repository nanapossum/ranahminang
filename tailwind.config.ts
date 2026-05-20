import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          bark: "#3f2618",
          clay: "#9d4f2f",
          gold: "#c99235",
          rice: "#f6ead2",
          moss: "#556b3e",
          ink: "#201610"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(63, 38, 24, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
