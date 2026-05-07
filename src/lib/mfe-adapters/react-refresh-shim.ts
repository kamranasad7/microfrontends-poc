// Dev-only: @vitejs/plugin-react transforms every JSX module to require a
// Fast Refresh preamble on the host page. SvelteKit doesn't run plugin-react,
// so without these stubs the React remote rejects with "can't detect
// preamble" the first time it's evaluated. Install the globals before any
// federated import that may pull in React modules.
//
// Idempotent — safe to call multiple times. The real /@react-refresh runtime
// is fetched from the remote's own dev server, so initial render works;
// in-host HMR for the React remote is intentionally not wired up.
export function installReactRefreshShims(): void {
	if (typeof window === 'undefined') return;
	const w = window as unknown as Record<string, unknown>;
	if (w.__vite_plugin_react_preamble_installed__) return;
	w.$RefreshReg$ ??= () => {};
	w.$RefreshSig$ ??= () => (type: unknown) => type;
	w.__vite_plugin_react_preamble_installed__ = true;
}
