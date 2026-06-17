/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        jp: ['"Noto Serif JP"', 'serif'],
        kr: ['"Noto Serif KR"', 'serif'],
      },
      colors: {
        ink: {
          50: '#F4F1EA',
          100: '#E8E4D8',
          200: '#D2CCBA',
          300: '#A39E8D',
          400: '#6E6A5C',
          500: '#3D3A33',
          600: '#252320',
          700: '#1A1816',
          800: '#131110',
          900: '#0B0B0F',
        },
        sakura: '#FF6B9D',
        jade: '#10B981',
        amber: '#F59E0B',
        electric: '#3B82F6',
        cinnabar: '#EF4444',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        reveal: 'reveal 0.6s ease-out both',
        shimmer: 'shimmer 3s linear infinite',
        flipIn: 'flipIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
