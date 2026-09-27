/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#FAF8F5',
        porcelain: '#FFFFFF',
        silk: '#F5EFE6',
        obsidian: {
          900: '#0F1012',
          DEFAULT: '#141518',
          800: '#1C1D22',
          700: '#2A2C33',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F4ECE0',
          200: '#E7D8C0',
          300: '#D8C19D',
          400: '#C5A880',
          500: '#B69260',
          600: '#9E7A49',
          700: '#7F5E33',
        },
        emerald: {
          prestige: '#132824',
          deep: '#1D3A34',
          subtle: '#2E534B',
          tint: '#EDF5F2',
        },
        warmgray: {
          50: '#F9F8F6',
          100: '#F2EFEB',
          200: '#E5E1D9',
          300: '#D3CDC2',
          400: '#9E978C',
          500: '#6E685E',
          600: '#4D473E',
          700: '#342F28',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(20, 21, 24, 0.05)',
        'luxury': '0 12px 36px -8px rgba(20, 21, 24, 0.08), 0 4px 12px -2px rgba(20, 21, 24, 0.04)',
        'luxury-hover': '0 20px 48px -12px rgba(182, 146, 96, 0.22), 0 8px 20px -4px rgba(20, 21, 24, 0.06)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
