/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          sand:  '#EEE9DF',
          stone: '#C9C1B1',
          amber: '#FFB162',
          rust:  '#A35139',
          navy:  '#2C3B4D',
          dark:  '#1B2632',
        },
      },
    },
  },
  plugins: [],
}
