/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange42: {
          100: "#ff9e00ff",
          200: "#ff9100ff",
          300: "#ff8500ff",
          400: "#ff7900ff",
          500: "#ff6d00ff",
        },
        purple42: {
          100: "#9d4eddff",
          200: "#7b2cbfff",
          300: "#5a189aff",
          500: "#240046ff",
          400: "#3c096cff",
        },
        black42: {
          100: "#27282B",
          200: "#21252B",
          300: "#1F1E21",
          400: "#16171B",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
