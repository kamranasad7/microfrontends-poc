import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { mfeBase, mfeUrl } from '../../tools/vite-mfe';

const NAME = 'settings';
const PORT = 3004;

export default defineConfig({
	...mfeBase(NAME, PORT),
	plugins: [
		react(),
		federation({
			name: NAME,
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.tsx',
				'./SettingsStore': './src/SettingsStore.ts'
			},
			// settings consumes auth/Service (auth state) and header/Service
			// (push notifications on save) — see README "Known limitations"
			// for why these nested remotes cost us hover-preload.
			remotes: {
				auth: {
					type: 'module',
					name: 'auth',
					entry: `${mfeUrl('auth', 3005)}/mf-manifest.json`
				},
				header: {
					type: 'module',
					name: 'header',
					entry: `${mfeUrl('header', 3003)}/mf-manifest.json`
				}
			},
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
