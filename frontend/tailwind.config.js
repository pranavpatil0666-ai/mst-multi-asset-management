/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mst: {
          red: "#e52e2e",
          deep: "#9D1C1F",
          flame: "#ff2d2d",
          dark: "#730000",
          blue: "#28276B",
          black: "#08080c",
          charcoal: "#120d12",
        },
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "'Montserrat'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
