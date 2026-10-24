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
        background: {
          DEFAULT: '#050B14',
          sidebar: '#07111F',
          surface: '#0A1524',
          elevated: '#0D1B2D',
          hover: '#132338',
        },
        border: {
          DEFAULT: '#1B3048',
          secondary: '#243D57',
          subtle: '#142538',
          accent: '#168BFF',
        },
        content: {
          primary: '#EAF2FF',
          secondary: '#9BB0CA',
          muted: '#7186A3',
          faint: '#4A5D78',
        },
        brand: {
          blue: '#168BFF',
          cyan: '#22D3EE',
          teal: '#00D6A0',
          violet: '#9A7BFF',
        },
        financial: {
          positive: '#00D6A0',
          negative: '#FF647C',
          warning: '#FFB547',
          neutral: '#9BB0CA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        panel: '0 4px 20px -2px rgba(0, 0, 0, 0.45), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(22, 139, 255, 0.25)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-teal': '0 0 20px rgba(0, 214, 160, 0.25)',
        'glow-violet': '0 0 20px rgba(154, 123, 255, 0.25)',
      },
    },
  },
  plugins: [],
}
