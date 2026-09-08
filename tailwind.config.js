/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clinical: {
          deep: '#1d3f5e',
          DEFAULT: '#275077',
          mid: '#4c7091',
          soft: '#44648e',
          cream: '#f9f7f1',
          paper: '#f2f4f7',
          lime: '#c1e55b',
          olive: '#39442b'
        },
        dark: {
          bg: '#00261c',
          surface: '#023326',
          card: 'rgba(4, 62, 48, 0.85)',
          border: 'rgba(0, 203, 135, 0.2)',
          accent: '#00cb87',
          hover: '#054737',
          text: '#f5f2eb',
          muted: '#a3c2b8'
        },
        light: {
          bg: '#f5f2eb',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e3ded5',
          accent: '#00473e',
          hover: '#ece7de',
          text: '#122620',
          muted: '#52665e'
        },
        forest: {
          DEFAULT: '#00473e',
          dark: '#00261c',
          deep: '#011c15',
          light: '#f5f2eb',
          mint: '#00cb87'
        }
      },
      fontFamily: {
        sans: ['Tajawal', 'Cairo', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'Tajawal', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
