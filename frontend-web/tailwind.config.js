/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        instagram: {
          blue: '#0095f6',
          darkblue: '#00376b',
          gray: '#8e8e8e',
          lightgray: '#fafafa',
          border: '#dbdbdb',
        }
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'instagram': '0 2px 4px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}