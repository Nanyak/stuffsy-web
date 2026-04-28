import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Remap slate to the cool-neutral scale so all slate-* utilities
      // inherit the design system without touching each component file.
      colors: {
        slate: {
          50:  'oklch(0.987 0.003 260)',
          100: 'oklch(0.965 0.004 260)',
          200: 'oklch(0.920 0.005 260)',
          300: 'oklch(0.860 0.007 260)',
          400: 'oklch(0.680 0.010 260)',
          500: 'oklch(0.530 0.010 260)',
          600: 'oklch(0.430 0.012 260)',
          700: 'oklch(0.330 0.012 260)',
          800: 'oklch(0.240 0.012 265)',
          900: 'oklch(0.180 0.014 260)',
          950: 'oklch(0.130 0.010 265)',
        },
        // Amber stays for folder icons
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      boxShadow: {
        card: '0 1px 2px oklch(0 0 0 / 0.04), 0 2px 4px oklch(0 0 0 / 0.03)',
        'card-hover': '0 2px 4px oklch(0 0 0 / 0.06), 0 4px 12px oklch(0 0 0 / 0.06)',
        'ring-primary': '0 0 0 3px oklch(0.545 0.185 268 / 0.15)',
      },
      letterSpacing: {
        tight: '-0.011em',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
