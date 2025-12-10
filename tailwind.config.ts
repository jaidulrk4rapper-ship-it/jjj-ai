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
      screens: {
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1279px'},
        'desktop': {'min': '1280px'},
      },
      spacing: {
        'canvas-padding': '24px',
      },
      maxWidth: {
        'mobile-canvas': '1080px',
        'tablet-canvas': '1440px',
        'desktop-canvas': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;

