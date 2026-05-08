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
				header: {
					type: 'module',
					name: 'header',
					entry: 'http://localhost:3003/mf-manifest.json'
				},
				settings: {
					type: 'module',
					name: 'settings',
					entry: 'http://localhost:3004/mf-manifest.json'
				}
			},
			// TEMP: shared svelte singleton causes a runtime crash in the
			// production host bundle (TypeError reading '__esModule' on a
			// shared chunk). Investigating — leave off for the build-validation
			// pass.
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
