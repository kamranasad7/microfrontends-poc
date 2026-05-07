import { installReactRefreshShims } from '$lib/mfe-adapters/react-refresh-shim';

export const ssr = false;

export const load = () => {
	installReactRefreshShims();
	// Fire-and-forget: starts the federated import to warm the browser cache.
	// We deliberately don't `await` — settings's mf-manifest declares its own
	// `remotes` (header — for the cross-framework auth Service consumption),
	// and the host's runtime takes longer than SK's hover-preload tolerates to
	// reconcile that nested-remote registration. Awaiting here makes SK report
	// "Internal Error" on hover. The dynamic import keeps progressing in the
	// background; ReactMFE's onMount picks up the cached promise on click.
	import('settings/App').catch(() => {});
};
