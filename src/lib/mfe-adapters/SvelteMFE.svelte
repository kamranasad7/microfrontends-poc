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

	// Sibling of ReactMFE.svelte without the @vitejs/plugin-react preamble shim.
	// Svelte remotes don't need any host-side global setup — `mount(Component,
	// { target, props })` inside the remote's `./App` is sufficient. With
	// singleton-shared svelte (declared on both host and remote), the remote
	// imports the host's svelte instance through the federation share scope.

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

<div bind:this={target} class="svelte-mfe-target"></div>
{#if !mounted && fallback}
	{@render fallback()}
{/if}

<style>
	.svelte-mfe-target {
		display: contents;
	}
</style>
