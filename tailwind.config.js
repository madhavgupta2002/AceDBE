/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#151d2e',
          light: '#1a2535',
          dark: '#0d1321',
          border: '#1e2d3d',
        },
        page: '#05080f',
      },
      fontSize: {
        '2xs': ['10px', '14px'],
      },
      zIndex: {
        sticky: '10',
        dropdown: '20',
        modal: '50',
      },
      boxShadow: {
        'card': '0 4px 24px 0 rgba(0,0,0,0.25)',
        'card-hover': '0 8px 32px 0 rgba(0,0,0,0.35)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.15)',
      },
    },
  },
  plugins: [],
}
