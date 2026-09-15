/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF9F5',
        ink: {
          DEFAULT: '#151A17',
          soft: '#4B554E',
          faint: '#7C867E',
        },
        line: '#E4E1D6',
        brand: {
          50: '#F2F8F4',
          100: '#E1EFE6',
          200: '#C0DECB',
          300: '#94C6A8',
          400: '#63A87F',
          500: '#3D8A61',
          600: '#2C6E4B',
          700: '#24583D',
          800: '#1D4632',
          900: '#152F22',
          950: '#0B1B14',
        },
        clay: {
          50: '#FBF4EE',
          100: '#F5E4D5',
          400: '#D89A67',
          500: '#C67C41',
          600: '#A6602C',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(21, 26, 23, 0.04), 0 8px 24px -8px rgba(21, 26, 23, 0.08)',
        card: '0 1px 2px rgba(21, 26, 23, 0.04), 0 2px 8px -2px rgba(21, 26, 23, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
