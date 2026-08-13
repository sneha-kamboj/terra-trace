/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canopy: {
          bg: "#0A100D",
          surface: "#10201A",
          surfacealt: "#16281F",
          border: "#223129",
          primary: "#2F6844",
          bright: "#5FBE84",
          amber: "#E3A857",
          red: "#E4572E",
          cyan: "#64D9C9",
          text: "#EDF2EE",
          muted: "#93A99C",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(95,190,132,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(95,190,132,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        gridsize: "28px 28px",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        scan: "scan 1.8s cubic-bezier(0.4,0,0.2,1) infinite",
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
        fadeUp: "fadeUp 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
