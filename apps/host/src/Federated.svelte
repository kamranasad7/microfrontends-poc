<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { getCached, setCached, type RendererModule } from './federated-cache';

  interface Props {
    load: () => Promise<RendererModule>;
    props?: Record<string, unknown>;
    fallback?: Snippet;
  }

  let { load, props = {}, fallback }: Props = $props();

  let target: HTMLDivElement | undefined = $state();
  // Always false on SSR; federated remotes are CSR-only here. On the client,
  // onMount synchronously calls render() if the loader is cached, skipping
  // the fallback on revisit.
  let mounted = $state(false);

  onMount(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const cached = getCached(load);
    if (cached && target) {
      cleanup = cached.render(target, props);
      mounted = true;
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

<div bind:this={target} class="federated-target"></div>
{#if !mounted && fallback}
  {@render fallback()}
{/if}

<style>
  .federated-target { display: contents; }
</style>
