export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(124, 58, 237, 0.16)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(94, 210, 255, 0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.18), transparent 28%)',
      },
      colors: {
        midnight: '#080a10',
        charcoal: '#11151f',
        surface: '#151a27',
        surface2: '#1a1f2b',
        accent: '#8b5cf6',
        accentSoft: '#7c3aed',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
