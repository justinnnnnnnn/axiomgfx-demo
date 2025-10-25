/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        // Flat aliases to ensure utilities like border-axiom-border-light exist
        'axiom-border-light': '#d9d8d4',
        'axiom-text-primary': '#0A0A0A',
        'axiom-text-secondary': '#3D3D3D',
        'axiom-text-light': '#5A5A5A',
        'axiom-bg-primary': '#ede9e6',
        'axiom-bg-card-white': '#fdfdfd',
        'axiom-bg-card-beige': '#f5f3f2',
        'axiom-bg-graph-white': '#f9faf8',
        'axiom-yellow-button': '#ffe14e',
        'axiom-yellow-hover': '#f0d42a',
        'axiom-yellow-light': '#ffffdf',
        'axiom-graph-blue': '#4f7ea9',
        'axiom-graph-green': '#46695c',
        // AxiomGFX EXACT Brand Colors - Direct Hex Values
        'axiom': {
          // Background Colors
          'bg-primary': '#ede9e6',
          'bg-card-white': '#fdfdfd',
          'bg-card-beige': '#f5f3f2',
          'bg-graph-white': '#f9faf8',
          
          // Gradient & Grooves
          'gradient-base': '#f3f2ef',
          'groove-light': '#e8e7e4',
          'groove-dark': '#d9d8d4',
          
          // Yellow Accents (Primary Brand)
          'yellow-button': '#ffe14e',
          'yellow-main': '#ffe562',
          'yellow-dark': '#ffe458',
          'yellow-light': '#ffffdf',
          'yellow-hover': '#f0d42a',
          
          // Data Visualization
          'graph-green': '#46695c',
          'graph-blue': '#4f7ea9',
          'graph-red': '#fdfdfd',
          
          // Text Colors
          'text-primary': '#0A0A0A',
          'text-secondary': '#3D3D3D',
          'text-light': '#5A5A5A',
          'link-white': '#ffffff',
          
          // Utility Colors
          'dark-button': '#333333',
          'black': '#000000',
          'border-light': '#d9d8d4',
        }
      }
    },
  },
  plugins: [],
}
