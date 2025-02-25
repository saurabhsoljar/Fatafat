/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary-200" : "#ffd966",
        "primary-100" : "#ffdf80",
        "secondary-200" : "#00d96b",
        "secondary-100" : "#1a2a8a"
      }
    },
  },
  plugins: [],
}