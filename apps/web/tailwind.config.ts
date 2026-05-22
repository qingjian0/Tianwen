import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#C41E3A',
        'primary-light': '#E63946',
        'primary-dark': '#8B0000',
        'gold': '#D4AF37',
        'gold-light': '#F4D03F',
        'gold-dark': '#B8860B',
        'bg-dark': '#12121A',
        'bg-medium': '#1A1A25',
        'bg-light': '#252530',
        'bg-card': '#1E1E2A',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A0A0B0',
        'text-muted': '#6B6B7B',
        'border': '#2A2A3A',
        'border-light': '#3A3A4A',
      },
      fontFamily: {
        'song': ['Noto Serif SC', 'SimSun', 'STSong', 'serif'],
        'kai': ['KaiTi', 'STKaiti', 'Noto Serif SC', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'red-glow': '0 0 15px rgba(196, 30, 58, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(212, 175, 55, 0.5)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
