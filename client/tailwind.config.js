/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#141416',
        surface: {
          DEFAULT: '#1A1A1D',
          raised: '#2B2B2F',
          border: 'rgba(255,255,255,0.06)',
          soft: '#212124',
        },
        primary: {
          DEFAULT: '#22D3D8',
          dark: '#1AB5B9',
        },
        secondary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
        },
        accent: {
          DEFAULT: '#10B981',
        },
        foreground: {
          DEFAULT: '#F2F2F0',
          muted: '#A0A0A5',
          faint: '#737378',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
