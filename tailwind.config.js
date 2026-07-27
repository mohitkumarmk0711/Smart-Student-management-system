/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#131A2B',
          900: '#1B2540',
          800: '#243157',
          700: '#324272',
        },
        gold: {
          500: '#C79A3E',
          400: '#D6AF5D',
          200: '#EFDFB8',
        },
        paper: '#F6F4EE',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
