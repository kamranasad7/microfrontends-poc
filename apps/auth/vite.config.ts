import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';
import { mfeBase, mfeUrl } from '../../tools/vite-mfe';

const NAME = 'auth';
const PORT = 3005;

export default defineConfig({
	...mfeBase(NAME, PORT),
	plugins: [
		vue(),
		federation({
			name: NAME,
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.ts'
			},
			// auth consumes header/Service to call Auth.login() — same nested-remote
			// shape as settings, same hover-preload trade-off (see README).
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
