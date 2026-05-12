import { sveltekit } from '@sveltejs/kit/vite';
import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';
import { mfeUrl } from '../../tools/vite-mfe';

const moduleRemote = (name: string, defaultPort: number) => ({
	type: 'module' as const,
	name,
	entry: `${mfeUrl(name, defaultPort)}/mf-manifest.json`
});

export default defineConfig({
	plugins: [
		sveltekit(),
		federation({
			name: 'host',
			remotes: {
				quizzes: moduleRemote('quizzes', 3001),
				students: moduleRemote('students', 3002),
				header: moduleRemote('header', 3003),
				settings: moduleRemote('settings', 3004)
			},
			// TEMP: shared svelte singleton causes a runtime crash in the
			// production host bundle (TypeError reading '__esModule' on a
			// shared chunk). Investigating — leave off for the build-validation
			// pass.
			shared: {},
			manifest: true,
			dts: true
		})
	]
});
