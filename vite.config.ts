import { sveltekit } from '@sveltejs/kit/vite';
import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		federation({
			name: 'host',
			// No remotes / exposes yet — just verifying the plugin coexists
			// with @sveltejs/kit's vite plugin without breaking dev or build.
			remotes: {},
			exposes: {},
			shared: {},
			manifest: true,
			dts: false
		})
	]
});
