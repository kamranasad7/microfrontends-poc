import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';

const PORT = 3001;

export default defineConfig({
	// vite's `base` becomes the manifest's publicPath — absolute URL needed so
	// the host (different origin) can resolve this remote's chunks correctly.
	base: `http://localhost:${PORT}/`,
	plugins: [
		svelte(),
		federation({
			name: 'quizzes',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.ts'
			},
			// TEMP: shared svelte singleton crashes in production bundles
			// (TypeError reading '__esModule' on a loadShare chunk). Each remote
			// bundles its own svelte runtime in this build; revisit when
			// chasing the singleton init issue. Dev works fine with sharing.
			shared: {},
			manifest: true,
			dts: true
		})
	],
	server: {
		port: PORT,
		strictPort: true,
		cors: true,
		origin: `http://localhost:${PORT}`
	},
	preview: { port: PORT, strictPort: true },
	build: {
		target: 'esnext',
		modulePreload: false,
		cssCodeSplit: false
	}
});
