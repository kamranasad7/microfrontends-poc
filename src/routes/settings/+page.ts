import { installReactRefreshShims } from '$lib/mfe-adapters/react-refresh-shim';

export const ssr = false;

export const load = async () => {
	// Must run BEFORE the React MFE's modules evaluate. Each transformed JSX
	// module emits top-level $RefreshReg$/$RefreshSig$ calls; without these
	// stubs the dynamic import rejects (federation surfaces it as a Promise
	// rejection value with no .message — confusingly opaque). ReactMFE.svelte
	// also installs the shim on mount; idempotent.
	installReactRefreshShims();
	await import('settings/App');
};
