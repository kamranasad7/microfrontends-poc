<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/quizzes', label: 'Quizzes' },
		{ href: '/students', label: 'Students' },
		{ href: '/settings', label: 'Settings' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<header>
		<strong>JuiceMind Quizzes</strong>
		<span class="tag">SvelteKit baseline (no MF)</span>
	</header>
	<div class="body">
		<aside>
			<nav>
				{#each links as link (link.href)}
					<a href={link.href} class:active={page.url.pathname === link.href}>{link.label}</a>
				{/each}
			</nav>
		</aside>
		<main>
			{@render children()}
		</main>
	</div>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
	}
	:global(*) {
		box-sizing: border-box;
	}
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
		font-family: system-ui, sans-serif;
	}
	header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 20px;
		height: 56px;
		background: #0f172a;
		color: white;
		flex-shrink: 0;
	}
	.tag {
		font-size: 12px;
		opacity: 0.6;
	}
	.body {
		display: flex;
		flex: 1;
		min-height: 0;
	}
	aside {
		width: 220px;
		background: #0f172a;
		color: #e2e8f0;
		padding: 16px;
		flex-shrink: 0;
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
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
	main {
		flex: 1;
		overflow-y: auto;
		background: #f8fafc;
	}
</style>
