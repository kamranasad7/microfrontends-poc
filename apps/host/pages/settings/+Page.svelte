<script lang="ts">
  import Federated from '../../src/Federated.svelte';
  import { loadSettings } from '../../src/federated-loaders';

  const settingsProps = {
    userName: 'Kamran',
    userEmail: 'kamran@juicemind.app',
    onSave: (data: unknown) =>
      alert('Host received settings save:\n' + JSON.stringify(data, null, 2)),
  };
</script>

<Federated load={loadSettings} props={settingsProps}>
  {#snippet fallback()}
    <div class="loading">Loading settings…</div>
  {/snippet}
</Federated>

<style>
  .loading { padding: 24px; color: #64748b; }
</style>
