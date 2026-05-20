<script lang="ts">
	import { onMount } from 'svelte';
	import type { HeaderProps } from './App';
	import * as Auth from 'auth/Service';
	import * as Notifications from './Service';
	import { settings, LANGUAGE_LABELS } from 'settings/SettingsStore';

	let { appName, accentColor = '#0f172a' }: HeaderProps = $props();

	let menuOpen = $state(false);
	let notifOpen = $state(false);

	// auth + notifications stores still use the hand-rolled pub/sub pattern;
	// settings is on Nanostores. Atoms implement Svelte's store contract, so
	// `$settings` below auto-subscribes and re-renders the header whenever
	// the React settings panel mutates it.
	let authState = $state(Auth.getAuthState());
	let notifs = $state(Notifications.getNotifications());

	onMount(() => {
		const u1 = Auth.onAuthChange((s) => (authState = s));
		const u2 = Notifications.onNotificationsChange((n) => (notifs = n));
		return () => {
			u1();
			u2();
		};
	});

	let unread = $derived(notifs.reduce((n, x) => n + (x.read ? 0 : 1), 0));

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function toggleNotif() {
		notifOpen = !notifOpen;
		if (notifOpen && unread > 0) Notifications.markAllRead();
	}

	function handleLogout() {
		menuOpen = false;
		Auth.logout();
	}

	// Header lives in every route's layout, so it can't show the credential
	// form itself — it just sends the user to /auth to sign in.
	function handleLogin() {
		if (typeof window !== 'undefined') window.location.href = '/auth';
	}
</script>

<header style="background: {accentColor}">
	<div class="left">
		<div class="logo"></div>
		<strong>{appName}</strong>
		<span class="tag">rendered by header MFE (Svelte)</span>
	</div>
	<div class="right">
		<span class="lang" title={LANGUAGE_LABELS[$settings.language]}>
			{$settings.language.toUpperCase()}
		</span>
		{#if authState.isAuthenticated && authState.user}
			<button class="bell" aria-label="Notifications" onclick={toggleNotif}>
				🔔
				{#if unread > 0}
					<span class="badge">{unread}</span>
				{/if}
			</button>
			{#if notifOpen}
				<div class="notif-menu" role="dialog">
					{#if notifs.length === 0}
						<div class="empty">No notifications</div>
					{:else}
						{#each notifs.slice(0, 8) as n (n.id)}
							<div class="notif">
								<div class="notif-text">{n.text}</div>
								<button type="button" class="dismiss" aria-label="Dismiss" onclick={() => Notifications.dismissNotification(n.id)}>×</button>
							</div>
						{/each}
					{/if}
				</div>
			{/if}
			<button class="user" onclick={toggleMenu}>
				<span class="avatar" style="background: {authState.user.avatarColor ?? '#7c3aed'}">
					{authState.user.name.charAt(0).toUpperCase()}
				</span>
				<span>{authState.user.name}</span>
			</button>
			{#if menuOpen}
				<div class="menu">
					<button type="button" onclick={handleLogout}>Log out</button>
				</div>
			{/if}
		{:else}
			<button class="login" type="button" onclick={handleLogin}>Sign in</button>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
		height: 56px;
		color: white;
		font-family: system-ui, sans-serif;
		flex-shrink: 0;
	}
	.left {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.logo {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: linear-gradient(135deg, #f59e0b, #ef4444);
	}
	.tag {
		font-size: 12px;
		opacity: 0.6;
	}
	.right {
		display: flex;
		align-items: center;
		gap: 12px;
		position: relative;
	}
	button {
		font: inherit;
		color: inherit;
		background: transparent;
		border: 0;
		cursor: pointer;
	}
	.lang {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 4px 9px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		color: white;
	}
	.bell {
		position: relative;
		font-size: 18px;
		padding: 4px 6px;
	}
	.badge {
		position: absolute;
		top: -2px;
		right: -4px;
		background: #ef4444;
		color: white;
		font-size: 10px;
		font-weight: 700;
		border-radius: 999px;
		min-width: 16px;
		height: 16px;
		padding: 0 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.user {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 10px 4px 4px;
		border-radius: 999px;
	}
	.user:hover {
		background: rgba(255, 255, 255, 0.08);
	}
	.avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 13px;
	}
	.login {
		padding: 6px 14px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		font-weight: 600;
	}
	.login:hover {
		background: rgba(255, 255, 255, 0.18);
	}
	.menu {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		background: white;
		color: #0f172a;
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
		min-width: 140px;
		padding: 6px;
		z-index: 10;
	}
	.menu button {
		width: 100%;
		text-align: left;
		padding: 8px 10px;
		border-radius: 6px;
		color: #0f172a;
	}
	.menu button:hover {
		background: #f1f5f9;
	}
	.notif-menu {
		position: absolute;
		top: calc(100% + 6px);
		right: 80px;
		background: white;
		color: #0f172a;
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
		min-width: 260px;
		max-width: 320px;
		padding: 6px;
		z-index: 10;
	}
	.empty {
		padding: 14px;
		color: #64748b;
		font-size: 13px;
		text-align: center;
	}
	.notif {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		border-radius: 6px;
	}
	.notif:hover {
		background: #f1f5f9;
	}
	.notif-text {
		flex: 1;
		font-size: 13px;
		color: #0f172a;
	}
	.dismiss {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		color: #94a3b8;
		font-size: 18px;
		line-height: 1;
	}
	.dismiss:hover {
		background: #e2e8f0;
		color: #0f172a;
	}
</style>
