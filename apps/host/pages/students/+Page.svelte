<script lang="ts">
  import Federated from '../../src/Federated.svelte';
  import { loadStudents } from '../../src/federated-loaders';
</script>

<Federated load={loadStudents} props={{ initialCount: 5 }}>
  {#snippet fallback()}
    <div class="loading">Loading remote…</div>
  {/snippet}
</Federated>

<style>
  .loading { padding: 24px; color: #64748b; }
</style>
