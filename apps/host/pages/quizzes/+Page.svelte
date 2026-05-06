<script lang="ts">
  import Federated from '../../src/Federated.svelte';
  import { loadQuizzes } from '../../src/federated-loaders';
</script>

<Federated load={loadQuizzes} props={{ greeting: 'Greetings from the host —' }}>
  {#snippet fallback()}
    <div class="loading">Loading remote…</div>
  {/snippet}
</Federated>

<style>
  .loading { padding: 24px; color: #64748b; }
</style>
