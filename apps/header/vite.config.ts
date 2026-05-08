import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';

const PORT = 3003;

export default defineConfig({
	// vite's `base` becomes the manifest's `publicPath`. Without an absolute
	// URL here, the build emits `publicPath: "/"`, which makes the host (on a
	// different origin) try to fetch this remote's chunks from its OWN origin
	// — 404s every asset. Hardcoded for the POC; in production this becomes
	// the CDN/deploy URL via an env var.
	base: `http://localhost:${PORT}/`,
	plugins: [
		svelte(),
		federation({
			name: 'header',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.ts',
				'./Service': './src/Service.ts'
			},
			// TEMP: shared svelte singleton crashes in production bundles
			// (see quizzes/vite.config.ts). Each remote bundles its own svelte.
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
