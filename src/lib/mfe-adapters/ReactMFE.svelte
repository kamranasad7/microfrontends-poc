<script lang="ts" generics="TProps extends object = object">
	import { onMount, type Snippet } from 'svelte';

	interface RendererModule<P> {
		render: (target: HTMLElement, props: P) => () => void;
	}

	interface Props {
		load: () => Promise<RendererModule<TProps>>;
		props: TProps;
		fallback?: Snippet;
	}

	let { load, props, fallback }: Props = $props();

	let target: HTMLDivElement | undefined = $state();
	let mounted = $state(false);

	// Dev-only: @vitejs/plugin-react transforms every JSX module to require a
	// Fast Refresh preamble on the host page. SvelteKit doesn't run
	// plugin-react, so without these stubs the React remote rejects with
	// "can't detect preamble". The real /@react-refresh runtime is fetched
	// from the remote's own dev server, so initial render works; in-host
	// HMR for the remote is intentionally not wired up.
	function installReactRefreshShims(): void {
		if (typeof window === 'undefined') return;
		const w = window as unknown as Record<string, unknown>;
		if (w.__vite_plugin_react_preamble_installed__) return;
		w.$RefreshReg$ ??= () => {};
		w.$RefreshSig$ ??= () => (type: unknown) => type;
		w.__vite_plugin_react_preamble_installed__ = true;
	}

	onMount(() => {
		installReactRefreshShims();

		let cleanup: (() => void) | null = null;
		let cancelled = false;

		load().then((mod) => {
			if (cancelled || !target) return;
			cleanup = mod.render(target, props);
			mounted = true;
		});

		return () => {
			cancelled = true;
			cleanup?.();
		};
	});
</script>

<div bind:this={target} class="react-mfe-target"></div>
{#if !mounted && fallback}
	{@render fallback()}
{/if}

<style>
	.react-mfe-target {
		display: contents;
	}
</style>
