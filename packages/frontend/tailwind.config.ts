/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.tsx",
    "./app/**/*.tsx",
    "./lib/**/*.tsx",
    "./shared/**/*.tsx",
  ],
  theme: {
    extend: {
      color: {
        white: "var(--color-white)",
      },
      spacing: {
        reg: "var(--padding)",
        inner: "var(--padding-inner)",
        "inner-constant": "var(--padding-inner-constant)",
        "half-inner": "calc(var(--padding-inner) / 2)",
        "quarter-inner": "calc(var(--padding-inner) / 4)",
      },
      screens: {
        sm: "375px",
        md: "425px",
        lg: "768px",
        max: "1024px",
      },
    },
  },
  plugins: [],
};
