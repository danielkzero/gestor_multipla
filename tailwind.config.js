/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  daisyui: {
    themes: [ "light", "sunset", "cupcake", "synthwave", "dark", "retro", "corporate" ],
  },
  plugins: [
    require('daisyui'),require('tailwindcss-primeui')
  ],
}