import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';
import { mfeBase } from '../../tools/vite-mfe';

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
				'./App': './src/App.ts',
				'./Service': './src/Service.ts'
			},
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
