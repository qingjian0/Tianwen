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
        ink: {
          '50': '#f4f4f6',
          '100': '#e4e4e8',
          '200': '#c8c8d0',
          '300': '#a0a0b0',
          '400': '#787890',
          '500': '#505070',
          '600': '#383850',
          '700': '#1a1a2e',
          '800': '#12121c',
          '900': '#0a0a0f',
          '950': '#050508',
        },
        gold: {
          '50': '#fefce8',
          '100': '#fef9c3',
          '200': '#fef08a',
          '300': '#fbbf24',
          '400': '#eab308',
          '500': '#ca8a04',
          '600': '#a16207',
          '700': '#854d0e',
          '800': '#713f12',
          '900': '#422006',
          '950': '#281304',
        },
        vermillion: {
          '50': '#fef2f2',
          '100': '#fee2e2',
          '200': '#fecaca',
          '300': '#fca5a5',
          '400': '#ef4444',
          '500': '#dc2626',
          '600': '#b91c1c',
          '700': '#991b1b',
          '800': '#7f1d1d',
          '900': '#450a0a',
          '950': '#2d0505',
        },
        indigo: {
          '50': '#eef2ff',
          '100': '#e0e7ff',
          '200': '#c7d2fe',
          '300': '#a5b4fc',
          '400': '#818cf8',
          '500': '#6366f1',
          '600': '#4f46e5',
          '700': '#4338ca',
          '800': '#3730a3',
          '900': '#1e1b4b',
          '950': '#13112e',
        },
        jade: {
          '50': '#ecfdf5',
          '100': '#d1fae5',
          '200': '#a7f3d0',
          '300': '#6ee7b7',
          '400': '#34d399',
          '500': '#10b981',
          '600': '#059669',
          '700': '#047857',
          '800': '#065f46',
          '900': '#022c22',
          '950': '#011a14',
        },
        'cosmic-black': '#0a0a0f',
        'cosmic-purple': '#4c1d95',
        'cosmic-gold': '#ca8a04',
        'cosmic-blue': '#1e40af',
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(202,138,4,0.3)',
        'glow-md': '0 0 16px rgba(202,138,4,0.4)',
        'glow-lg': '0 0 32px rgba(202,138,4,0.5)',
      },
      dropShadow: {
        glow: '0 0 12px rgba(202,138,4,0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        'fade-slide-up': 'fade-slide-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(202,138,4,0.3)',
          },
          '50%': {
            boxShadow: '0 0 24px rgba(202,138,4,0.6)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;