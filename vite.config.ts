import { sveltekit } from '@sveltejs/kit/vite';
import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		federation({
			name: 'host',
			remotes: {
				quizzes: {
					type: 'module',
					name: 'quizzes',
					entry: 'http://localhost:3001/mf-manifest.json'
				},
				students: {
					type: 'module',
					name: 'students',
					entry: 'http://localhost:3002/mf-manifest.json'
				},
				settings: {
					type: 'module',
					name: 'settings',
					entry: 'http://localhost:3004/mf-manifest.json'
				}
			},
			// Share svelte as a singleton across host + every Svelte remote so
			// only one svelte runtime ships to the browser, and stores/contexts
			// stay identity-equal across MFEs. React MFEs (settings) don't share
			// anything — they bundle their own runtime.
			shared: {
				svelte: { singleton: true, requiredVersion: '^5.55.0' },
				'svelte/': { singleton: true }
			},
			manifest: true,
			dts: true
		})
	]
});
