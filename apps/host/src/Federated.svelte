<script lang="ts">
  import { onMount } from 'svelte';

  interface RendererModule<P> {
    render: (target: HTMLElement, props: P) => () => void;
  }

  interface Props {
    load: () => Promise<RendererModule<Record<string, unknown>>>;
    props?: Record<string, unknown>;
    fallback?: import('svelte').Snippet;
  }

  let { load, props = {}, fallback }: Props = $props();

  let target = $state<HTMLDivElement | undefined>();
  let mounted = $state(false);

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

<div bind:this={target} class="federated-mount" data-mounted={mounted}>
  {#if !mounted && fallback}
    {@render fallback()}
  {/if}
</div>

<style>
  .federated-mount { display: contents; }
</style>
