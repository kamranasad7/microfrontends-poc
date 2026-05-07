import { init, loadRemote } from '@module-federation/runtime';
import type { render as RenderSettings } from 'settings/App';

// MF's vite plugin auto-bootstraps the federation runtime by transforming
// any file that does `import('<remote>/<expose>')`. In the SvelteKit + Vite 8
// setup that transform doesn't complete (the bare specifier survives the
// rewrite), so dynamic-import-by-string fails. Workaround: skip the transform
// entirely — initialize the runtime in code and call loadRemote directly.

let initialized = false;
function ensureRuntime() {
	if (initialized) return;
	initialized = true;
	init({
		name: 'host',
		remotes: [
			{
				name: 'settings',
				alias: 'settings',
				entry: 'http://localhost:3004/mf-manifest.json'
			}
		]
	});
}

interface SettingsAppModule {
	render: typeof RenderSettings;
}

export const loadSettings = async (): Promise<SettingsAppModule> => {
	ensureRuntime();
	const mod = await loadRemote<SettingsAppModule>('settings/App');
	if (!mod) throw new Error('Failed to load settings/App');
	return mod;
};
