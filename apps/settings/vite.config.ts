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
				'./App': './src/App.tsx'
			},
			// settings consumes header/Service — see README "Known limitations"
			// for why this nested-remote declaration costs us hover-preload.
			remotes: {
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
