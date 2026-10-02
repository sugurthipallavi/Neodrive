/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neo: {
          black: '#030508',
          navy: '#050a14',
          slate: '#0a1526',
          cyan: '#00d4ff',
          violet: '#a855f7',
          magenta: '#e879f9',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Exo 2', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-glow':
          'linear-gradient(rgba(0,212,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(168,85,247,0.15), transparent)',
      },
      boxShadow: {
        neon: '0 0 20px rgba(0,212,255,0.45), 0 0 60px rgba(168,85,247,0.25)',
        'neon-sm': '0 0 12px rgba(0,212,255,0.35)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.85', filter: 'brightness(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
