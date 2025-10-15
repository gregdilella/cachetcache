import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';




export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}'
	],
	safelist: [
		// Preserve highlight.js classes
		{ pattern: /^hljs-/ }
	],
	theme: {
		extend: {
			fontFamily: {
				girly: ['Poppins', 'sans-serif'],
				heading: ['Sacramento', 'cursive']
			},
			colors: {
				sage: {
					50: '#f6f7f4',
					100: '#e8ebe3',
					200: '#d1d7c7',
					300: '#b1bca0',
					400: '#93a07b',
					500: '#7a8960',
					600: '#5f6d4a',
					700: '#4b563c',
					800: '#3e4733',
					900: '#353c2d',
				},
				mimosa: {
					50: '#fffef7',
					100: '#fff9e6',
					200: '#fff4bc',
					300: '#ffee92',
					400: '#ffe768',
					500: '#ffe03e',
					600: '#e6c935',
					700: '#ccb22f',
					800: '#b39b29',
					900: '#998423',
				}
			},
			keyframes: {
				'blur-in': {
					'0%': { filter: 'blur(12px)', opacity: '0' },
					'100%': { filter: 'blur(0)', opacity: '1' }
				}
			},
			animation: {
				'blur-in': 'blur-in 0.7s ease-out both'
			}
		}
	},
	plugins: [
		forms,
		typography,
		animate
	]
} satisfies Config;
