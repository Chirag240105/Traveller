export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f6ff',
          100: '#eef0ff',
          200: '#dce2ff',
          300: '#b9c6ff',
          400: '#8f9dff',
          500: '#6a75ff',
          600: '#5059e6',
          700: '#3f43b0',
          800: '#33368d',
          900: '#2a2c77'
        },
        ocean: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#b8daff',
          300: '#7ab8ff',
          400: '#3391ff',
          500: '#006eff',
          600: '#0054cc',
          700: '#0040a3',
          800: '#051129',
          900: '#081e47',
          950: '#020b18'
        },
        sunset: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6B35',
          600: '#FF8C42',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        charcoal: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          800: '#1f2937',
          900: '#0f172a',
          950: '#030712'
        },
        warm: {
          50: '#fdfdfc',
          100: '#fbfbfa',
          200: '#f7f5f0',
          300: '#f3ece3'
        }
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        editorial: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
