/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          light: "#f4ebe8",
          DEFAULT: "#6f4e37",
          dark: "#4b3621",
        },
        accent: "#c0a17d", // gold-beige
        rich: "#362e25", // rich espresso
        cream: "#fef9f4", // light cream
        charcoal: "#1f1d1a",
      },
    },
  },
  plugins: [],
};
