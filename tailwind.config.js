/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#faf5f0',
          100: '#f0e4d4',
          200: '#e0c6a5',
          300: '#cda574',
          400: '#be874e',
          500: '#b07340',
          600: '#995c36',
          700: '#7d462e',
          800: '#683a2b',
          900: '#573126',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}