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
        dark: {
          bg: '#00101f',
          surface: '#00182e',
          card: 'rgba(0, 24, 46, 0.75)',
          border: 'rgba(0, 217, 255, 0.15)',
          accent: '#00d9ff',
          hover: '#00284c',
          text: '#f1f5f9',
          muted: '#94a3b8'
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          accent: '#0284c7',
          hover: '#f1f5f9',
          text: '#0f172a',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
