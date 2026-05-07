<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import SvelteMFE from '$lib/mfe-adapters/SvelteMFE.svelte';
	import type { HeaderProps } from 'header/App';

	let { children } = $props();

	const loadHeader = () => import('header/App');

	const headerProps: HeaderProps = {
		appName: 'JuiceMind Quizzes',
		user: { name: 'Kamran', avatarColor: '#7c3aed' },
		accentColor: '#0f172a',
		notificationCount: 3,
		onLogout: () => alert('Host received logout from header MFE')
	};

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
	<SvelteMFE load={loadHeader} props={headerProps}>
		{#snippet fallback()}
			<div class="header-fallback"></div>
		{/snippet}
	</SvelteMFE>
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
	/* Matches the federated header's chrome so first paint doesn't shift. */
	.header-fallback {
		height: 56px;
		background: #0f172a;
		flex-shrink: 0;
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
