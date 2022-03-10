const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        secondary: 'var(--secondary)',
        inverse: 'var(--inverse)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
      },
    },
  },
  plugins: [],
}
