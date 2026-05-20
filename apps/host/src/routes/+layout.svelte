<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import SvelteMFE from '$lib/mfe-adapters/SvelteMFE.svelte';
	import type { HeaderProps } from 'header/App';

	let { children } = $props();

	const loadHeader = () => import('header/App');

	const headerProps: HeaderProps = {
		appName: 'JuiceMind Quizzes',
		accentColor: '#0f172a'
	};

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/quizzes', label: 'Quizzes' },
		{ href: '/students', label: 'Students' },
		{ href: '/settings', label: 'Settings' },
		{ href: '/auth', label: 'Sign in' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app" data-sveltekit-preload-data="hover" data-sveltekit-preload-code="hover">
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
	/* Theme tokens. The settings-store sets `<html data-theme="dark">` on the
	 * document root; the dark block below overrides the defaults. Every MFE's
	 * scoped CSS uses these var()s, so the flip cascades into all federated
	 * remotes automatically — no per-MFE JS subscription needed for theming. */
	:global(:root) {
		--bg-page: #f8fafc;
		--bg-card: #ffffff;
		--bg-muted: #f1f5f9;
		--text-primary: #0f172a;
		--text-muted: #64748b;
		--border: #e2e8f0;
		--border-strong: #cbd5e1;
		color-scheme: light;
	}
	:global([data-theme='dark']) {
		--bg-page: #0f172a;
		--bg-card: #1e293b;
		--bg-muted: #0b1220;
		--text-primary: #f1f5f9;
		--text-muted: #94a3b8;
		--border: #334155;
		--border-strong: #475569;
		color-scheme: dark;
	}
	:global(html, body) {
		margin: 0;
		padding: 0;
		background: var(--bg-page);
		color: var(--text-primary);
		transition: background-color 120ms ease, color 120ms ease;
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
		background: var(--bg-page);
		color: var(--text-primary);
	}
</style>
