"use strict";Object.defineProperty(exports, "__esModule", {value: true});/** @type {import('tailwindcss').Config} */
exports. default = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: '#D2B48C', // Color madera claro
        'wood-darker': '#8B4513', // Color madera oscuro
        gold: '#DAA520', // Color dorado
        'gold-dark': '#B8860B', // Color dorado oscuro,
        'action-button': '#4fb3c8'
      },
      backgroundImage: {
        'white-to-gold': 'linear-gradient(to right, #ffffff, #fff4e6, #ffedcc, #ffe2b3, #ffd699, #ffcc80, #ffbf66, #ffb34d, #ffaa33, #ff9f1a, #ff9900)',
        'blue-to-gray': 'linear-gradient(to right, #f0f4f8, #d9e2ec, #9fb3c8)',
      },      
    },
  },
  plugins: [],
}
 /* v7-6d18ccf857ac85b0 */