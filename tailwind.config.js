// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4EC5A5',
        secondary: '#F7F7F7', 
        accent: '#333333',
        text: {
          primary: '#222222',
          secondary: '#666666',
        }
      },
    },
  },
  plugins: [],
}