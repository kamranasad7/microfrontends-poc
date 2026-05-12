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
			// settings consumes header/Service (cross-framework auth). Vite's
			// import-analysis and the MF dts plugin both need header declared
			// here so the bare specifier resolves at build time.
			//
			// KNOWN LIMITATION: declaring nested remotes here bakes them into
			// settings's mf-manifest.json, and SK's hover-preload context can't
			// reconcile that nested-remote handshake within its preload window
			// (App.tsx never fetches on hover; click works fine because the
			// page lifecycle gives it more time). Tried fire-and-forget,
			// manual hover handlers, runtime init + loadRemote, and host-to-
			// settings prop drilling. Each was patchier than this. We keep
			// the clean direct import and accept that /settings doesn't get
			// the same hover-to-instant feel as /quizzes and /students.
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
