/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EF",
        ink: "#4A4458",
        blush: {
          100: "#FDE8E8",
          200: "#FBD5D5",
          400: "#F49A9A",
          500: "#EE7B7B",
        },
        peach: {
          100: "#FFF0E5",
          200: "#FFDFC7",
          400: "#FFB98A",
          500: "#F79C5C",
        },
        butter: {
          100: "#FFF8DC",
          200: "#FFEFB0",
          400: "#F7D96B",
        },
        mint: {
          100: "#E6F7EF",
          200: "#C9EEDD",
          400: "#7FD8B0",
          500: "#4FC48F",
          600: "#33A874",
        },
        sky: {
          100: "#E7F3FD",
          200: "#CBE5FA",
          400: "#84C1F2",
          500: "#5AA9E8",
          600: "#3E8FD4",
        },
        lav: {
          100: "#F1ECFB",
          200: "#E2D8F7",
          300: "#C9B6EF",
          400: "#A98BE3",
          500: "#8E6AD1",
          600: "#7554B8",
        },
      },
      fontFamily: {
        display: ["'Baloo 2'", "ui-rounded", "sans-serif"],
        sans: ["Nunito", "ui-rounded", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(74, 68, 88, 0.12)",
        pop: "0 8px 30px -6px rgba(142, 106, 209, 0.35)",
        floaty: "0 10px 30px -14px rgba(74, 68, 88, 0.18)",
      },
      borderRadius: {
        blob: "2rem",
      },
      keyframes: {
        "cq-float": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(14px,-18px) scale(1.05)" },
        },
        "cq-bob": {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        "cq-blink": {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.1)" },
        },
        "cq-pop-in": {
          "0%": { transform: "scale(0.4)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "cq-wiggle": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-5px)" },
          "80%": { transform: "translateX(5px)" },
        },
        "cq-glow": {
          "0%": { opacity: 0, transform: "scale(0.7)" },
          "40%": { opacity: 0.55 },
          "100%": { opacity: 0, transform: "scale(1.4)" },
        },
        "cq-burst": {
          "0%": { transform: "translate(0,0) scale(0) rotate(0deg)", opacity: 1 },
          "55%": { opacity: 1 },
          "100%": { transform: "translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot))", opacity: 0 },
        },
        "belt-move": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "56px 0" },
        },
      },
      animation: {
        "cq-float": "cq-float 12s ease-in-out infinite",
        "cq-float-rev": "cq-float 15s ease-in-out infinite reverse",
        "cq-bob": "cq-bob 4s ease-in-out infinite",
        "cq-blink": "cq-blink 5s ease-in-out infinite",
        "cq-pop-in": "cq-pop-in 0.4s cubic-bezier(.34,1.56,.64,1)",
        "cq-wiggle": "cq-wiggle 0.5s ease",
        "cq-glow": "cq-glow 1.2s ease-out",
        "cq-burst": "cq-burst 1.2s ease-out forwards",
        "belt-move": "belt-move 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
