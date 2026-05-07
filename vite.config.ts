import { sveltekit } from '@sveltejs/kit/vite';
import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		federation({
			name: 'host',
			remotes: {
				settings: {
					type: 'module',
					name: 'settings',
					entry: 'http://localhost:3004/mf-manifest.json'
				}
			},
			// No framework sharing across federation — each remote bundles its
			// own runtime. Render-fn contract makes this safe.
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
