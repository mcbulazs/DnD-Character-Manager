/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'mystic-blue': '#1A1F71',  // Equivalent to 'purple'
        'dragon-blood': '#8B0000',  // Equivalent to 'midnight'
        'ancient-gold': '#B8860B',  // Equivalent to 'metal'
        'forest-green': '#228B22',  // Equivalent to 'tahiti'
        'shadow-black': '#2C2C2C',  // Equivalent to 'silver'
        'arcane-purple': '#4B0082',  // Equivalent to 'bubble-gum'
        'parchment-beige': '#f0cc8f',  // Equivalent to 'bermuda'
        'light-parchment-beiage': '#f6e1bc',  // Equivalent to 'bermuda'
      },
      screens: {
        'xs': '480px',
        // => @media (min-width: 480px)
      },
    },
    
  },
  plugins: [],
}

