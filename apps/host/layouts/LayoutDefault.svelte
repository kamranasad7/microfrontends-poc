<script lang="ts">
  import Sidebar from '../src/Sidebar.svelte';
  import Federated from '../src/Federated.svelte';

  let { Page }: { Page: import('svelte').Component<Record<string, unknown>> } = $props();

  const loadHeader = () => import('header/App');
  const headerProps = {
    appName: 'JuiceMind Quizzes',
    user: { name: 'Kamran', avatarColor: '#7c3aed' },
    accentColor: '#0f172a',
    onLogout: () => alert('Host received logout from header MFE'),
  };
</script>

<div class="app">
  <Federated load={loadHeader} props={headerProps}>
    {#snippet fallback()}
      <div class="header-fallback"></div>
    {/snippet}
  </Federated>
  <div class="body">
    <Sidebar />
    <main>
      <Page />
    </main>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    font-family: system-ui, sans-serif;
  }
  .body { display: flex; flex: 1; min-height: 0; }
  main {
    flex: 1;
    overflow-y: auto;
    background: #f8fafc;
  }
  .header-fallback {
    height: 56px;
    background: #0f172a;
    flex-shrink: 0;
  }
  :global(html, body) { margin: 0; padding: 0; }
  :global(*) { box-sizing: border-box; }
</style>
