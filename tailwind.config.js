/** @type {import('tailwindcss').Config} */

import { default as flattenColorPalette } from 'tailwindcss/lib/util/flattenColorPalette'

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"))
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, value]) => [`--${key}`, value])
  )

  addBase({
    ":root": newVars
  })
}

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily:{
      montserrat:['"montserrat"', "sans-serif"],
    },
    extend: {
      colors: {
        // customPink : '#26A69A',
        customPink : '#f03385',
        customBlue : '#00b0f0',
        customBaseBlue:'#7fd6f5',
        customDarkGray : '#343637',

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },

  },
  plugins: [addVariablesForColors],
};
