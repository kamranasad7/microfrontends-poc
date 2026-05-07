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
			// settings is also a *consumer* — it imports header/Service to read
			// auth state and drive its own logout button. Cross-framework: a
			// React MFE consuming a Svelte MFE's pure-TS service module.
			remotes: {
				header: {
					type: 'module',
					name: 'header',
					entry: 'http://localhost:3003/mf-manifest.json'
				}
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
