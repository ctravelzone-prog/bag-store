/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#5b0f1e', dark: '#420a15', light: '#6d1423', soft: '#f7ecee' },
        gold: { DEFAULT: '#c9a227', light: '#e6c65a', dark: '#9a7b1a' },
      },
      fontFamily: { serif: ['Georgia', 'Times New Roman', 'serif'] },
    },
  },
  plugins: [],
};
