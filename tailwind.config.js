/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './**/*.html'],
  theme: {
    extend: {
      colors: {
        appyYellow: '#F7A42B', // Ersätt med din faktiska guldfärg
        appyOrange: '#F1531A', // Ersätt med din faktiska orangefärg
        appyTurquoise: '#2BAAA8', // Ersätt med din faktiska turkosfärg
        appyNavy: '#1B1E3C', // Ersätt med din faktiska marinblå färg
        appyBeige: '#FAEAD7', // Ersätt med din faktiska beigefärg
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
