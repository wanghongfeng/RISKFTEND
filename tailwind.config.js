/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        haier: {
          blue: '#005AAA', // Haier Primary Blue
          dark: '#002855',
          light: '#E6F0F9',
        },
        risk: {
          critical: '#FF4D4F',
          high: '#FAAD14',
          medium: '#1890FF',
          low: '#52C41A',
        }
      }
    },
  },
  plugins: [],
}
