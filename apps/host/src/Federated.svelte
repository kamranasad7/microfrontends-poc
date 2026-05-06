<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    load: () => Promise<{ default: Component<any> }>;
    props?: Record<string, unknown>;
    fallback?: import('svelte').Snippet;
  }

  let { load, props = {}, fallback }: Props = $props();
  let Resolved = $state<Component<any> | null>(null);
  let status = $state<'pending' | 'loaded' | 'error'>('pending');

  $effect(() => {
    console.log('[Federated] effect firing, calling load()');
    load()
      .then((mod) => {
        console.log('[Federated] loaded', mod);
        Resolved = mod.default;
        status = 'loaded';
      })
      .catch((err) => {
        console.error('[Federated] load failed', err);
        status = 'error';
      });
  });
</script>

{#if status === 'loaded' && Resolved}
  <Resolved {...props} />
{:else if status === 'error'}
  <div style="padding: 24px; color: #dc2626;">Failed to load remote</div>
{:else if fallback}
  {@render fallback()}
{/if}
