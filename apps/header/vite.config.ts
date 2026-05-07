import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';

const PORT = 3003;

export default defineConfig({
	plugins: [
		svelte(),
		federation({
			name: 'header',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.ts'
			},
			// Singleton svelte across host + all remotes (see quizzes/vite.config).
			shared: {
				svelte: { singleton: true, requiredVersion: '^5.55.0' },
				'svelte/': { singleton: true }
			},
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
