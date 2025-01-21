/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  daisyui: {
    themes: [ "light", "sunset", "synthwave" ],
  },
  plugins: [
    require('daisyui'),require('tailwindcss-primeui')
  ],
}