/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        'sm': '400px'
      },
    },
    extend: {
      colors: {
        'main-bg-900': '#000C79',
        'blue-600': '#000C79',
        'primary-500': '#000C79',
        'primary-600': '#5D5FEF',
        'title-headings': '#242D35',
        'secondary-500': '#FFB620',
        'secondary-link': '#4F5B67',
        'secondary-gray' : '#F0F0F0',
        'secondary-light' : '#F8F8F8',
        'secondary-light-gray' : '#CCD1DB',
        'light-gray': "#F6F6F6",
        'light-blue': "#E8EBFF",
        'secondary-border':'#EDEDED',
        'off-white': '#D0DFFF',
        'error': '#BB2124',
        'success-green': '#3BAE28',
        'dark-1': '#000000',
        'dark-2': '#09090A',
        'dark-3': '#101012',
        'dark-4': '#1F1F22',
        'light-1': '#FFFFFF',
        'light-2': '#EFEFEF',
        'light-3': '#7878A3',
        'light-4': '#5C5C7B',
        'light-5': '#89909F',
        'danger':"#FF0000",
        'success':"#274e13",
        'info':'#2f0084',
        'secondary-label':'#4B4B4B',
        'success-role' : '#1C8420',
        
      },

      screens: {
        'xs': '480px',
      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],

      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};