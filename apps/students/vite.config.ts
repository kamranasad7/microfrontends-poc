import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';
import { cssHashFor, mfeBase } from '../../tools/vite-mfe';

const NAME = 'students';
const PORT = 3002;

export default defineConfig({
	...mfeBase(NAME, PORT),
	plugins: [
		svelte({ compilerOptions: { cssHash: cssHashFor(NAME) } }),
		federation({
			name: NAME,
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.ts'
			},
			// TEMP: shared svelte singleton crashes in production bundles
			// (see quizzes/vite.config.ts). Each remote bundles its own svelte.
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
