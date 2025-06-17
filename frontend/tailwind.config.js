// File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1A2238",
        charcoal: "#2C2F3A",
        "neon-green": "#39FF14",
        "electric-purple": "#BF40BF",
      },
      fontFamily: {
        orbitron: ["Orbitron", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        drift: "drift 10s linear infinite",
        "pulse-glow": "pulse 2s infinite",
        "slide-in": "slide-in 0.3s ease-in",
        "fade-in": "fade-in 0.3s ease-in",
        shake: "shake 0.3s ease-in-out",
        "spin-trophy": "spin-trophy 5s infinite linear",
        "spin-slow": "spin 5s linear infinite",
        "pulse-custom": "pulse 1s infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
