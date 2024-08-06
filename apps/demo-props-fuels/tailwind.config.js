/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				display: ['proxima-nova', 'sans-serif'],
				body: ['proxima-nova', 'sans-serif'],
				sans: ['proxima-nova', 'sans-serif']
			}
		}
	},
	daisyui: {
		themes: [
			{
				props: {
					primary: '#0033FF',
					secondary: '#0d0d0d', // Almost black for secondary color
					accent: '#1a1a1a', // Dark grey for accent
					neutral: '#0d0d0d', // Almost black for neutral
					'base-100': '#0d0d0d', // Almost black for base-100
					'base-200': '#1a1a1a', // Dark grey for base-200
					'base-300': '#262626', // Slightly lighter dark grey for base-300
					info: '#3a3a3a', // Dark grey for info
					success: '#28a745', // Green for success
					warning: '#ffc107', // Yellow for warning
					error: '#dc3545', // Red for error
					content: '#f5f5f5' // Light grey for content
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
