<script lang="ts">
  import Federated from '../../src/Federated.svelte';
  const loadQuizzes = () => import('quizzes/App');
</script>

<Federated load={loadQuizzes} props={{ greeting: 'Greetings from the host —' }}>
  {#snippet fallback()}
    <div class="loading">Loading remote…</div>
  {/snippet}
</Federated>

<style>
  .loading { padding: 24px; color: #64748b; }
</style>
