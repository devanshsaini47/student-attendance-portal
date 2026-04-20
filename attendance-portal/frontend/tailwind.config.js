/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0F1E',
        surface: '#111827',
        'surface-light': '#1a2235',
        cyan: {
          DEFAULT: '#00D4FF',
          50: '#E6FAFF',
          100: '#B3F0FF',
          200: '#80E6FF',
          300: '#4DDBFF',
          400: '#1AD1FF',
          500: '#00D4FF',
          600: '#00A8CC',
          700: '#007D99',
          800: '#005266',
          900: '#002633',
        },
        purple: {
          DEFAULT: '#7C3AED',
          50: '#F3EAFF',
          100: '#DBC3FE',
          200: '#C39CFE',
          300: '#AB75FD',
          400: '#934EFD',
          500: '#7C3AED',
          600: '#6326C4',
          700: '#4A1D93',
          800: '#321362',
          900: '#190A31',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        'text-primary': '#F1F5F9',
        'text-muted': '#94A3B8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        float: 'floatUp 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        spin: 'spin 1s linear infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.2)' },
        },
        floatUp: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(0, 212, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 212, 255, 0.8)' },
        },
      },
      backdropBlur: {
        '20': '20px',
      },
    },
  },
  plugins: [],
};
