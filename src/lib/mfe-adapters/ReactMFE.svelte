<script lang="ts" generics="TProps extends object = object">
	import { onMount, type Snippet } from 'svelte';
	import { installReactRefreshShims } from './react-refresh-shim';

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

	onMount(() => {
		// Belt-and-braces: SK's +page.ts also installs these before triggering
		// the federated import on hover-preload, but ReactMFE may be used from
		// non-SK contexts (e.g. a route without a matching +page.ts).
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
