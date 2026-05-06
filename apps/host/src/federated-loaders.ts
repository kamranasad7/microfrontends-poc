// Stable function references for every federated module loader. Each route
// imports the same arrow from here, so the Federated cache (keyed by function
// reference) hits across navigations.

export const loadHeader = () => import('header/App');
export const loadQuizzes = () => import('quizzes/App');
export const loadStudents = () => import('students/App');
export const loadSettings = () => {
  ensureReactRefreshShims();
  return import('settings/App');
};

// Dev-only: @vitejs/plugin-react transforms every JSX module to require a
// Fast Refresh preamble on the host page. Our Svelte host doesn't run
// plugin-react, so the flag is missing and the React remote rejects with
// "can't detect preamble". Setting these globals satisfies the check; the
// real /@react-refresh runtime is fetched from the remote's own dev server.
// (HMR for the React remote inside the host is not wired up — production
// builds don't need any of this.)
function ensureReactRefreshShims(): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as Record<string, unknown>;
  if (w.__vite_plugin_react_preamble_installed__) return;
  w.$RefreshReg$ ??= () => {};
  w.$RefreshSig$ ??= () => (type: unknown) => type;
  w.__vite_plugin_react_preamble_installed__ = true;
}
