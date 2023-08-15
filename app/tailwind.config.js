/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundColor: {
                'primary-bg': '#7c7c7c',
                'secondary-bg': '#1E1E1E',
            },
            textColor: {
                'primary': '#E0E0E0',
                'secondary': '#B0B0B0',
            },
            borderColor: {
                'custom-border': '#2E2E2E',
            },
            colors: {
                'primary-accent': '#2A5ADA',
                'secondary-accent': '#4A78D4',
                'tertiary-accent': '#6A9CE9',
                'error': '#E57373',
                'success': '#81C784',
            }
        },
    },
    plugins: [],
}
