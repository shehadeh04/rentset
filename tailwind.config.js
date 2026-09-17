/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F2F2F0',
        surface: '#FFFFFF',
        sunken: '#EAEAE7',
        ink: {
          DEFAULT: '#0C0C0C',
          soft: '#6E6E6B',
          faint: '#9A9A96',
          subtle: '#C4C4BF',
        },
        line: {
          DEFAULT: '#E4E4E1',
          strong: '#D2D2CE',
        },
        positive: {
          50: '#EDF4EE',
          500: '#3D7A4E',
          600: '#2F6340',
          700: '#254E33',
        },
        caution: {
          50: '#FAF2E3',
          300: '#E0BB78',
          500: '#B5852B',
          600: '#94691C',
          700: '#6F4E15',
        },
        critical: {
          50: '#FBEEEC',
          200: '#F0BDB2',
          500: '#B84228',
          600: '#98331D',
          700: '#742717',
          800: '#571D12',
        },
      },
      fontFamily: {
        sans: ['"Geist Variable"', '"Geist"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Geist Variable"', '"Geist"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        'display-sm': ['2.5rem', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.0', letterSpacing: '-0.025em' }],
        'display-lg': ['4.75rem', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        DEFAULT: '0 1px 2px rgba(12, 12, 12, 0.04)',
        xs: '0 1px 2px rgba(12, 12, 12, 0.04)',
        card: '0 1px 3px rgba(12, 12, 12, 0.05)',
        lifted: '0 12px 32px -12px rgba(12, 12, 12, 0.18)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
