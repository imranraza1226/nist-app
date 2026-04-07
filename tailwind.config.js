/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          50: '#E8EEF5',
          100: '#C5D4E6',
          200: '#9FB8D5',
          300: '#789CC4',
          400: '#5A85B8',
          500: '#3D6FAB',
          600: '#1E3A5F',
          700: '#162C4A',
          800: '#0F1F35',
          900: '#081220',
        },
        accent: {
          DEFAULT: '#00BCD4',
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
        dark: {
          bg: '#0F1923',
          card: '#1A2535',
          border: '#2A3F5F',
          text: '#E2E8F0',
          muted: '#94A3B8',
        },
        light: {
          bg: '#F0F4F8',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#1E293B',
          muted: '#64748B',
        },
      },
    },
  },
  plugins: [],
};
