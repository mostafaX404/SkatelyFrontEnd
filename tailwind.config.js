/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7d00fa',
          light: '#a855f7',
          dark: '#6b00d4',
        },
        success: {
          DEFAULT: '#16a34a',
          light: '#dcfce7',
          border: '#86efac',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
          border: '#fca5a5',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
  important: true
}
