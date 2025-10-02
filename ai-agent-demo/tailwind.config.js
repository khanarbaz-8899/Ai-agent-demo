/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // Scan all files in app folder
    "./components/**/*.{js,ts,jsx,tsx}" // Scan all files in components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
