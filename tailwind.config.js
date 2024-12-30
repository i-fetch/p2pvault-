

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line to include all files in the src directory
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000', // Set pure black as background in dark mode
        text: '#ffffff', // Optional: set text to white in dark mode
      },
    },
   
  },
  plugins: [],
};


