import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';
import { cssHashFor, mfeBase, mfeUrl } from '../../tools/vite-mfe';

const NAME = 'quizzes';
const PORT = 3001;

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
			// quizzes consumes auth/Service to get the JWT for its oRPC client.
			// Nested-remote — same hover-preload trade-off as settings/auth.
			remotes: {
				auth: {
					type: 'module',
					name: 'auth',
					entry: `${mfeUrl('auth', 3005)}/mf-manifest.json`
				}
			},
			// TEMP: shared svelte singleton crashes in production bundles
			// (TypeError reading '__esModule' on a loadShare chunk). Each remote
			// bundles its own svelte runtime in this build; revisit when
			// chasing the singleton init issue. Dev works fine with sharing.
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
