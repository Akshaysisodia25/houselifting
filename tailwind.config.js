/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict Dark Editorial Palette
        dark: {
          bg: '#080808',
          subtle: '#0D0D0D',
          surface: '#121212',
          card: '#171717',
          hover: '#1E1E1E',
          line: '#2A2A2A',
          border: '#2A2A2A',
          borderLight: '#3A3A3A',
        },
        brand: {
          black: '#080808',
          dark: '#0E0E0E',
          surface: '#151515',
          card: '#171717',
          line: '#2A2A2A',
          text: '#F5F5F0',
          muted: '#A0A0A0',
          dim: '#707070',
          accent: '#C2410C',          // Industrial safety terracotta/orange
          'accent-bright': '#EA580C',
          'accent-hover': '#9A3412',
        },
        navy: {
          950: '#080808',
          900: '#0E0E0E',
          800: '#141414',
          700: '#202020',
          600: '#2A2A2A',
        },
        steel: {
          900: '#0C0C0C',
          800: '#171717',
          700: '#262626',
          600: '#404040',
          500: '#707070',
          400: '#A0A0A0',
          300: '#CCCCCC',
          200: '#E5E5E0',
          100: '#F5F5F0',
          50: '#FAFAFA',
        },
        amber: {
          400: '#EA580C',
          500: '#C2410C',
          600: '#9A3412',
          700: '#7C2D12',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'mega-wide': '0.35em',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
