/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './**/*.html'],
  safelist: [
    'hover:text-[#38776e]',
    'justify-start',
    'justify-end',
    'self-end',
    'rounded-t-2xl',
    'rounded-l-2xl',
    'rounded-br-none',
    'rounded-full',
    'rounded-2xl',
    'rounded-3xl',
  ],
  theme: {
    extend: {
      colors: {
        appyYellow: '#F7A42B',
        appyOrange: '#F1531A',
        appyTurquoise: '#2BAAA8',
        appyNavy: '#1B1E3C',
        appyBeige: '#FAEAD7',
      },
      fontFamily: {
        edu: ['"Edu VIC WA NT Beginner"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        fade: 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
