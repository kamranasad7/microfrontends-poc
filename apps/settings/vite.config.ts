import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

const PORT = 3004;

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: 'settings',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.tsx'
			},
			// No react sharing across federation: each remote bundles its own
			// runtime. Sharing risks the framework-runtime hijack we hit on the
			// svelte-vike branch when Svelte was shared.
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
