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
        'imperial-gold': {
          50: '#FFF9E6',
          100: '#F4D03F',
          200: '#D4AF37',
          300: '#B8860B',
          400: '#9A6D00',
          DEFAULT: '#D4AF37',
        },
        'vermillion': {
          DEFAULT: '#C41E3A',
          light: '#E63946',
          dark: '#8B0000',
        },
        'jade': {
          DEFAULT: '#228B22',
          light: '#32CD32',
          dark: '#006400',
        },
        'bg': {
          primary: '#FFFFFF',
          secondary: '#FAFAFA',
          tertiary: '#F5F5F5',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        'text': {
          primary: '#1A1A1A',
          secondary: '#666666',
          muted: '#999999',
        },
        'border': {
          DEFAULT: '#E5E5E5',
          light: '#D0D0D0',
        },
      },
      fontFamily: {
        'song': ['Noto Serif SC', 'SimSun', 'STSong', 'serif'],
        'kai': ['KaiTi', 'STKaiti', 'Noto Serif SC', 'serif'],
        'mono': ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-imperial-gold': 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 50%, #B8860B 100%)',
        'gradient-deep-space': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 50%, #F5F5F5 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
