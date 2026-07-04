import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fondible Brand Palette
        cream:      { DEFAULT: '#F7F2E8', dark: '#EDE6D6', 2: '#F0E8D6' },
        brown:      { DEFAULT: '#2C1810', mid: '#5C3D2E', light: '#8B6655' },
        gold:       { DEFAULT: '#C8820A', light: '#E8A830', pale: '#F5DFA0', ultra: '#FBF0CC' },
        fondible: {
          cream:     '#F7F2E8',
          'cream-dark': '#EDE6D6',
          brown:     '#2C1810',
          'brown-mid': '#5C3D2E',
          gold:      '#C8820A',
          'gold-light': '#E8A830',
          'gold-pale': '#F5DFA0',
        },
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-up':        'fadeUp 0.6s ease forwards',
        'marquee':        'marquee 24s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'pulse-slow':     'pulse 2s ease-in-out infinite',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 70% at 50% 35%, #EFE3C0 0%, #F7F2E8 65%)',
        'card-gradient': 'linear-gradient(135deg, #1A0F08 0%, #2C1810 50%, #1F120A 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
      },
      boxShadow: {
        'brand-sm':  '0 2px 16px rgba(44,24,16,0.12)',
        'brand-md':  '0 8px 32px rgba(44,24,16,0.18)',
        'brand-lg':  '0 20px 60px rgba(44,24,16,0.22)',
        'gold-glow': '0 8px 28px rgba(200,130,10,0.35)',
        'wa-glow':   '0 6px 20px rgba(37,211,102,0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
