/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          light: '#C4D2AB',
          DEFAULT: '#B5C49C',
          dark: '#A0B086',
        },
        cream: {
          pure: '#FFFFFF',
          DEFAULT: '#F4F6F0',
          dark: '#E4E8DC',
        },
        charcoal: {
          light: '#282C21',
          DEFAULT: '#1B1E16',
          dark: '#11130E',
        },
        coral: {
          DEFAULT: '#E54B54',
          dark: '#D43841',
        },
        mint: {
          light: '#A8E0AC',
          DEFAULT: '#7BD695',
        },
        brand: {
          50: '#fff9e6',
          100: '#fff0bf',
          200: '#ffe699',
          300: '#ffd966',
          400: '#f5b731',
          500: '#E8A200',
          600: '#c78a00',
          700: '#a67200',
          800: '#855b00',
          900: '#1B1E16',
          950: '#11130E',
        },
        dark: {
          bg: '#1B1E16',
          card: '#F4F6F0',
          'card-hover': '#FFFFFF',
          border: 'rgba(27,30,22,0.1)',
        },
      },
      fontFamily: {
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '32px',
        '4xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
