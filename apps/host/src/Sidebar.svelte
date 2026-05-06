<script lang="ts">
  import { layoutState } from './layout-state.svelte';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/students', label: 'Students' },
  ];
</script>

<aside>
  <div class="brand">JuiceMind Quizzes</div>
  <nav>
    {#each links as link (link.href)}
      <a
        href={link.href}
        class:active={layoutState.pageContext?.urlPathname === link.href}
      >{link.label}</a>
    {/each}
  </nav>
</aside>

<style>
  aside {
    width: 220px;
    background: #0f172a;
    color: #e2e8f0;
    padding: 16px;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .brand {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 16px;
  }
  nav { display: flex; flex-direction: column; gap: 4px; }
  a {
    display: block;
    padding: 10px 14px;
    border-radius: 6px;
    text-decoration: none;
    color: #e2e8f0;
  }
  a.active {
    background: #334155;
    color: white;
  }
</style>
