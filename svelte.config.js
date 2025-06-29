import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	vitePlugin: {
		inspector: true
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// Cloudflare Pages specific options
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		csp: {
			directives: {
				'script-src': [
					'self',
					'unsafe-inline',
					'https://kit.fontawesome.com',
					'https://va.vercel-scripts.com',
					'https://vitals.vercel-insights.com'
				],
				'connect-src': [
					'self',
					'https://vitals.vercel-insights.com',
					'https://vercel-insights.com',
					'https://jdpseiwgyppmyhkxesyc.supabase.co',
					'https://3c687933a8de78d69da8abaa15b32629.r2.cloudflarestorage.com'
				],
				'img-src': [
					'self',
					'data:',
					'https:',
					'https://3c687933a8de78d69da8abaa15b32629.r2.cloudflarestorage.com'
				],
				'font-src': [
					'self',
					'https://fonts.gstatic.com',
					'https://kit.fontawesome.com'
				],
				'style-src': [
					'self',
					'unsafe-inline',
					'https://fonts.googleapis.com'
				]
			},
			mode: 'auto'
		}
	}
};
export default config;
