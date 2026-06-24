/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#1c1c24',
        content: '#edeef1',
        accent: '#3b6ef6',
        hairline: '#ececee',
        sidebar: {
          DEFAULT: '#1b1b1d',
          card: '#232327',
          'card-border': '#2f2f34',
          pill: '#2c2c30',
          'pill-border': '#393940',
          label: '#6b6d72',
          nav: '#9a9ca1',
        },
        // Status tokens
        fits: {
          fg: '#167a45',
          bg: '#e9f5ee',
          border: '#cfe9d8',
          dot: '#1f9d57',
          row: '#fbfdfc',
          rowb: '#eef4f0',
        },
        conflict: {
          fg: '#b3261e',
          bg: '#fcecea',
          border: '#f3d2cd',
          dot: '#e0473a',
          row: '#fefafa',
          rowb: '#f7e4e1',
        },
        unrelated: {
          fg: '#6f6b64',
          bg: '#f1f1ef',
          border: '#e7e6e1',
          dot: '#b0aaa2',
          row: '#fbfbfa',
          rowb: '#eeeeec',
        },
        // Part-type tints (bg + fg)
        'type-frame': { bg: '#eaf0fd', fg: '#3b6ef6' },
        'type-crankset': { bg: '#fdeee2', fg: '#e0843a' },
        'type-wheelset': { bg: '#e7f5ee', fg: '#1f9d57' },
        'type-cassette': { bg: '#f3edfb', fg: '#7c4ec4' },
        'type-bb': { bg: '#fceef4', fg: '#c2477e' },
        'type-tire': { bg: '#eef4e6', fg: '#6f8a2f' },
        'type-fork': { bg: '#eaf0fd', fg: '#3b78d6' },
        'type-chain': { bg: '#f3ece0', fg: '#927b45' },
      },
    },
  },
  plugins: [],
};
