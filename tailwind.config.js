/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './app/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('tailwindcss-react-aria-components')],
}