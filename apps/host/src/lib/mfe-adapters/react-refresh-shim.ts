// Dev-only: every JSX module that @vitejs/plugin-react transforms emits
// top-level calls to `window.$RefreshReg$(...)` and `window.$RefreshSig$()`.
// In a normal React app, plugin-react injects a virtual preamble script
// into index.html that defines those globals. Federation breaks the
// assumption — when our SvelteKit host imports the React MFE's modules
// cross-origin, the host page never received plugin-react's preamble, so
// the globals are undefined and the first transformed module throws on
// load. Define no-op stubs before any React module evaluates.
//
// The older `__vite_plugin_react_preamble_installed__` flag (a separate
// "did the preamble run?" check) was removed in plugin-react 6.x — no
// longer needed.
//
// Idempotent — safe to call multiple times.
export function installReactRefreshShims(): void {
	if (typeof window === 'undefined') return;
	const w = window as unknown as Record<string, unknown>;
	if (w.$RefreshReg$) return;
	w.$RefreshReg$ = () => {};
	w.$RefreshSig$ = () => (type: unknown) => type;
}
