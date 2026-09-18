/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Editorial palette: near-black ink, paper greys, and two deep
        // scene colours used as full-bleed blocks.
        ink: {
          DEFAULT: '#111213',
          soft: 'rgba(17, 18, 19, 0.62)',
          faint: 'rgba(17, 18, 19, 0.42)',
          subtle: 'rgba(17, 18, 19, 0.22)',
        },
        paper: '#F5F5F5',
        canvas: '#F5F5F5',
        surface: '#FFFFFF',
        sunken: '#EBEBEB',
        deck: '#FFFFFF',
        line: {
          DEFAULT: '#D7D7D7',
          strong: '#BFBFBF',
        },
        navy: {
          DEFAULT: '#19243A',
          soft: '#243350',
        },
        clay: {
          DEFAULT: '#2E2520',
          soft: '#3E332C',
        },
        shell: {
          DEFAULT: '#111213',
          soft: '#1C1D1F',
          line: '#2A2C2E',
          text: 'rgba(255, 255, 255, 0.64)',
          muted: 'rgba(255, 255, 255, 0.40)',
        },
        // Status, desaturated to sit inside the editorial palette.
        brand: {
          50: '#EDF1EE',
          100: '#D3DED6',
          300: '#7E9C89',
          500: '#3C6B4F',
          600: '#2F5540',
          700: '#244233',
        },
        positive: { 50: '#EDF1EE', 500: '#3C6B4F', 600: '#2F5540', 700: '#244233' },
        caution: { 50: '#F7F1E6', 300: '#D8BE8C', 500: '#9A7534', 600: '#7C5D27', 700: '#5E461D' },
        critical: { 50: '#F7ECEA', 200: '#E3B8B0', 500: '#9E4634', 600: '#833628', 700: '#662A1F', 800: '#4C1F17' },
      },
      fontFamily: {
        sans: ['"Instrument Sans Variable"', '"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Sans Variable"', '"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.03em',
        tight2: '-0.02em',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        // Display scale: regular weight, 1.0 leading, -0.03em — the signature.
        'd1': ['clamp(2.75rem, 7.5vw, 6.5rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'd2': ['clamp(2.25rem, 5.5vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'd3': ['clamp(1.75rem, 3.6vw, 2.75rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'd4': ['clamp(1.375rem, 2.2vw, 1.875rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        'metric': ['2rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'metric-lg': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        DEFAULT: '0 1px 2px rgba(17, 18, 19, 0.05)',
        card: '0 1px 3px rgba(17, 18, 19, 0.06)',
        lifted: '0 12px 32px -12px rgba(17, 18, 19, 0.20)',
        pop: '0 8px 28px -8px rgba(17, 18, 19, 0.24), 0 2px 6px -2px rgba(17,18,19,0.08)',
        dialog: '0 24px 64px -16px rgba(17, 18, 19, 0.34)',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.375rem',
        xl: '0.5rem',
        pill: '999px',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'rise': { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'overlay-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'dialog-in': { from: { opacity: '0', transform: 'translateY(8px) scale(0.985)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        'menu-in': { from: { opacity: '0', transform: 'translateY(-4px) scale(0.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        'sheet-in': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'toast-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        rise: 'rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'overlay-in': 'overlay-in 0.16s ease-out',
        'dialog-in': 'dialog-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        'menu-in': 'menu-in 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
        'sheet-in': 'sheet-in 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-in': 'toast-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
