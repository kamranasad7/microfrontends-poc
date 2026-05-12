import { installReactRefreshShims } from '$lib/mfe-adapters/react-refresh-shim';

// Federated remotes are CSR-only.
export const ssr = false;

export const load = async () => {
  installReactRefreshShims();
	await import('settings/App');
}
