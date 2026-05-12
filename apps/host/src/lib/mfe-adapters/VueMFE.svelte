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

	// Same shape as SvelteMFE — Vue, like Svelte, needs no host-side preamble
	// shim. The remote's `./App` does `createApp(Component, props).mount(target)`
	// and returns `() => app.unmount()` for cleanup.

	onMount(() => {
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

<div bind:this={target} class="vue-mfe-target"></div>
{#if !mounted && fallback}
	{@render fallback()}
{/if}

<style>
	.vue-mfe-target {
		display: contents;
	}
</style>
