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
        // Wispr Flow Core Tokens
        'lavender-whisper': '#f0d7ff',
        'forest-ink': '#034f46',
        'ember-glow': '#ffa946',
        'vast-ink': '#1a1a1a',
        'lumen-cream': '#ffffeb',
        'lumen-stone': '#e4e4d0',
        'fog': '#8a8a80',
        'charcoal': '#1a1a1a',
        'pure-white': '#ffffff',

        // Color aliases for backwards compatibility
        cream: {
          DEFAULT: '#ffffeb',
          pure: '#ffffff',
          dark: '#e4e4d0',
        },
        coral: {
          DEFAULT: '#ffa946',
          dark: '#034f46',
        },
        mint: {
          light: '#f0d7ff',
          DEFAULT: '#034f46',
        },
        
        // Named surface aliases
        surface: {
          cream: '#ffffeb',
          dark: '#1a1a1a',
          lavender: '#f0d7ff',
          forest: '#034f46',
          stone: '#e4e4d0',
        },
      },
      fontFamily: {
        garamond: ['"EB Garamond"', '"Cormorant Garamond"', 'serif'],
        display: ['"EB Garamond"', '"Cormorant Garamond"', 'serif'],
        figtree: ['Figtree', 'Inter', 'sans-serif'],
        sans: ['Figtree', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['120px', { lineHeight: '0.85', letterSpacing: '-3.6px' }],
        'heading-lg': ['64px', { lineHeight: '0.95', letterSpacing: '-1.92px' }],
        'heading': ['48px', { lineHeight: '0.95', letterSpacing: '0px' }],
        'heading-sm': ['32px', { lineHeight: '1.3', letterSpacing: '-0.96px' }],
        'subheading': ['24px', { lineHeight: '1.3' }],
        'body-lg': ['20px', { lineHeight: '1.3' }],
        'body-sm': ['16px', { lineHeight: '1.3' }],
        'caption': ['14px', { lineHeight: '1.3' }],
      },
      borderRadius: {
        'input': '12px',
        'button': '12px',
        'badge-sq': '8px',
        'card': '32px',
        'chamber': '40px',
        'chamber-lg': '80px',
        'pill': '9999px',
      },
      borderWidth: {
        '2': '2px',
        'ink': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'waveform-pulse': 'waveformPulse 1.2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        waveformPulse: {
          '0%': { transform: 'scaleY(0.3)' },
          '100%': { transform: 'scaleY(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
