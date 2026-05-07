<script lang="ts">
	import type { HeaderProps } from './App';

	let {
		appName,
		user,
		accentColor = '#0f172a',
		notificationCount = 3,
		onLogout
	}: HeaderProps = $props();

	let menuOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function handleLogout() {
		menuOpen = false;
		onLogout?.();
	}
</script>

<header style="background: {accentColor}">
	<div class="left">
		<div class="logo"></div>
		<strong>{appName}</strong>
		<span class="tag">rendered by header MFE (Svelte)</span>
	</div>
	<div class="right">
		<button class="bell" aria-label="Notifications">
			🔔
			{#if notificationCount > 0}
				<span class="badge">{notificationCount}</span>
			{/if}
		</button>
		<button class="user" onclick={toggleMenu}>
			<span class="avatar" style="background: {user.avatarColor ?? '#7c3aed'}">
				{user.name.charAt(0).toUpperCase()}
			</span>
			<span>{user.name}</span>
		</button>
		{#if menuOpen}
			<div class="menu">
				<button type="button" onclick={handleLogout}>Log out</button>
			</div>
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
</style>
