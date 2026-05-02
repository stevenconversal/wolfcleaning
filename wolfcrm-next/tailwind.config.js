/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        wc: {
          blue: '#1D4ED8',
          'blue-light': '#EFF6FF',
          'blue-mid': '#DBEAFE',
          'blue-dark': '#1E3A8A',
          green: '#059669',
          'green-light': '#ECFDF5',
          'green-bg': '#DCFCE7',
          amber: '#D97706',
          'amber-light': '#FEF3C7',
          red: '#DC2626',
          purple: '#6D5DD3',
          'purple-bg': '#EDE9FE',
          surface: '#FAFAF8',
          card: '#FFFFFF',
          border: '#E8E5DE',
          'border-light': '#F0EDE6',
          text: '#1A1A18',
          'text-sec': '#6B6960',
          'text-ter': '#9C978C',
          sidebar: '#141413',
        },
      },
    },
  },
  plugins: [],
};
