import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

const PORT = 3004;

export default defineConfig({
	// vite's `base` becomes the manifest's publicPath — absolute URL needed so
	// the host (different origin) can resolve this remote's chunks correctly.
	base: `http://localhost:${PORT}/`,
	plugins: [
		react(),
		federation({
			name: 'settings',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.tsx'
			},
			// settings is also a *consumer* — Settings.tsx imports header/Service
			// for the cross-framework auth demo. Settings's own dev server (3004)
			// needs MF to know about header so its import-analysis can resolve
			// the bare specifier.
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
