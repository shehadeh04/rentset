/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF9',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0B0B0C',
          soft: '#54545C',
          faint: '#8A8A92',
        },
        line: '#E3E3E0',
        brand: {
          50: '#FFF1E8',
          100: '#FFDDC7',
          200: '#FFB98C',
          300: '#FC8F4E',
          400: '#F06B22',
          500: '#D8500C',
          600: '#B03F08',
          700: '#883108',
          800: '#602309',
          900: '#3B1505',
          950: '#210B02',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        DEFAULT: '0 1px 2px rgba(11, 11, 12, 0.04)',
        card: '0 1px 2px rgba(11, 11, 12, 0.03), 0 6px 16px -8px rgba(11, 11, 12, 0.08)',
        panel: '0 8px 24px -8px rgba(11, 11, 12, 0.12)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.75rem',
        '2xl': '0.75rem',
      },
    },
  },
  plugins: [],
}
