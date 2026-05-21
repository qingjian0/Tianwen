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
        'imperial': {
          'gold': '#D4AF37',
          'gold-light': '#F4D03F',
          'gold-dark': '#B8860B',
          'gold-muted': 'rgba(212, 175, 55, 0.15)',
        },
        'vermillion': {
          '500': '#C41E3A',
          '400': '#E63946',
          '600': '#8B0000',
          'muted': 'rgba(196, 30, 58, 0.15)',
        },
        'jade': {
          '500': '#228B22',
          '400': '#32CD32',
          '600': '#006400',
          'muted': 'rgba(34, 139, 34, 0.15)',
        },
        'celestial': {
          'blue': '#1E3A5F',
          'blue-light': '#2E5A8F',
          'blue-dark': '#0F1F3F',
          'blue-muted': 'rgba(30, 58, 95, 0.2)',
        },
        'ink': {
          'black': '#0A0A0F',
          'dark': '#12121A',
          'medium': '#1A1A25',
          'light': '#252530',
        },
        'parchment': {
          '500': '#F5E6C8',
          '600': '#D4C4A8',
          'muted': 'rgba(245, 230, 200, 0.08)',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(212, 175, 55, 0.3)',
        'red-glow': '0 0 20px rgba(196, 30, 58, 0.2)',
        'jade-glow': '0 0 20px rgba(34, 139, 34, 0.2)',
        'palace': '0 8px 40px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(212, 175, 55, 0.1)',
        'pillar': 'inset 3px 0 10px rgba(0, 0, 0, 0.3), inset -3px 0 10px rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        'song': ['Noto Serif SC', 'SimSun', 'STSong', 'serif'],
        'kai': ['KaiTi', 'STKaiti', 'Noto Serif SC', 'serif'],
        'zhuang': ['ZCOOL KuaiLe', 'Noto Serif SC', 'serif'],
      },
      animation: {
        'float-pillar': 'float-pillar 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'cloud-float': 'cloud-float 25s ease-in-out infinite',
        'roof-shine': 'roof-shine 6s ease-in-out infinite',
        'seal-stamp': 'seal-stamp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        'float-pillar': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(-8px)', opacity: '0.9' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.25)',
          },
          '50%': {
            boxShadow: '0 0 35px rgba(212, 175, 55, 0.5)',
          },
        },
        'cloud-float': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(30px)' },
        },
        'roof-shine': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'seal-stamp': {
          '0%': { transform: 'scale(0.8) rotate(-8deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(-3deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
