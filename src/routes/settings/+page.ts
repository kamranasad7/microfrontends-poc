import { installReactRefreshShims } from '$lib/mfe-adapters/react-refresh-shim';

export const ssr = false;

export const load = async () => {
	// Must run BEFORE the React MFE's modules evaluate, otherwise plugin-react's
	// preamble check throws and SK fails the preload with "Internal Error".
	// ReactMFE.svelte also installs the shim on mount; idempotent.
	installReactRefreshShims();
	await import('settings/App');
};
