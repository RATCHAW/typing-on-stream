/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['PressStart', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        border: '#1C1C1C',
        background: '#111',
        secondary: '#BABABA'
      },
      boxShadow: {
        custimized: '0px 0px 8px 0px #F2F2F2'
      }
    }
  },
  plugins: []
};
