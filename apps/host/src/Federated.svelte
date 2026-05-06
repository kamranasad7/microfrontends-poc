<script lang="ts">
  import { onMount } from 'svelte';
  import { getCached, setCached } from './federated-cache';

  interface RendererModule<P> {
    render: (target: HTMLElement, props: P) => () => void;
  }

  interface Props {
    load: () => Promise<RendererModule<Record<string, unknown>>>;
    props?: Record<string, unknown>;
    fallback?: import('svelte').Snippet;
  }

  let { load, props = {}, fallback }: Props = $props();

  let target: HTMLDivElement | undefined = $state();
  // Initialize mounted=true if cache hit so the fallback never paints on revisit.
  // First-visit cache miss starts as false → fallback renders briefly until load() resolves.
  let mounted = $state(getCached(load) !== undefined);

  onMount(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const cached = getCached(load);
    if (cached && target) {
      cleanup = cached.render(target, props);
    } else {
      load().then((mod) => {
        if (cancelled || !target) return;
        setCached(load, mod);
        cleanup = mod.render(target, props);
        mounted = true;
      });
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  });
</script>

<div bind:this={target} class="federated-mount">
  {#if !mounted && fallback}
    {@render fallback()}
  {/if}
</div>

<style>
  .federated-mount { display: contents; }
</style>
