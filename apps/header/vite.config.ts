import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';
import { cssHashFor, mfeBase, mfeUrl } from '../../tools/vite-mfe';

const NAME = 'header';
const PORT = 3003;

export default defineConfig({
	...mfeBase(NAME, PORT),
	plugins: [
		svelte({ compilerOptions: { cssHash: cssHashFor(NAME) } }),
		federation({
			name: NAME,
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.ts',
				'./Service': './src/Service.ts'
			},
			// header consumes auth/Service for the Sign-in / Log-out buttons.
			// Nested-remote — same hover-preload trade-off as settings/auth.
			remotes: {
				auth: {
					type: 'module',
					name: 'auth',
					entry: `${mfeUrl('auth', 3005)}/mf-manifest.json`
				}
			},
			// TEMP: shared svelte singleton crashes in production bundles
			// (see quizzes/vite.config.ts). Each remote bundles its own svelte.
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
