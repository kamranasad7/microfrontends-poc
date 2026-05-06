<script lang="ts">
  interface User { name: string; avatarColor?: string; }
  interface Notification { id: string; text: string; read: boolean; }
  interface Props {
    appName: string;
    user: User;
    accentColor?: string;
    onLogout?: () => void;
  }

  let { appName, user, accentColor = '#0f172a', onLogout }: Props = $props();

  let notifications = $state<Notification[]>([
    { id: '1', text: 'New comment on your PR', read: false },
    { id: '2', text: 'Build #482 succeeded', read: false },
    { id: '3', text: 'You were mentioned in #general', read: false },
    { id: '4', text: 'Weekly report is ready', read: true },
  ]);
  let openPanel = $state<'none' | 'notifications' | 'user'>('none');

  let unread = $derived(notifications.filter((n) => !n.read).length);

  function markAllRead() {
    notifications = notifications.map((n) => ({ ...n, read: true }));
  }
</script>

<header style="background: {accentColor}">
  <div class="left">
    <div class="logo"></div>
    <strong>{appName}</strong>
    <span class="tag">rendered by header MFE (Svelte)</span>
  </div>
  <div class="right">
    <button
      class="bell"
      aria-label="Notifications"
      onclick={() => openPanel = openPanel === 'notifications' ? 'none' : 'notifications'}
    >
      🔔
      {#if unread > 0}<span class="badge">{unread}</span>{/if}
    </button>
    <button
      class="user"
      onclick={() => openPanel = openPanel === 'user' ? 'none' : 'user'}
    >
      <span class="avatar" style="background: {user.avatarColor ?? '#6366f1'}">
        {user.name.charAt(0).toUpperCase()}
      </span>
      <span>{user.name}</span>
    </button>
  </div>

  {#if openPanel === 'notifications'}
    <div class="panel" style="right: 88px;">
      <div class="panel-head">
        <span>Notifications</span>
        {#if unread > 0}
          <button class="link" onclick={markAllRead}>Mark all read</button>
        {/if}
      </div>
      <ul>
        {#each notifications as n (n.id)}
          <li class:read={n.read}>
            {#if !n.read}<span class="dot"></span>{/if}
            <span>{n.text}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if openPanel === 'user'}
    <div class="panel" style="right: 20px;">
      <div class="panel-head">{user.name}</div>
      {#if onLogout}
        <button class="logout" onclick={() => { openPanel = 'none'; onLogout?.(); }}>
          Sign out
        </button>
      {/if}
    </div>
  {/if}
</header>

<style>
  header {
    color: white; padding: 0 20px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: system-ui, sans-serif; position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .left { display: flex; align-items: center; gap: 12px; }
  .logo {
    width: 28px; height: 28px; border-radius: 6px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
  }
  .tag { opacity: 0.5; font-size: 12px; margin-left: 8px; }
  .right { display: flex; align-items: center; gap: 8px; }
  .bell, .user {
    background: transparent; border: 0; color: white; cursor: pointer;
    padding: 8px; border-radius: 6px; position: relative;
  }
  .bell { font-size: 20px; }
  .user { display: flex; align-items: center; gap: 8px; padding: 4px 8px; }
  .avatar {
    width: 30px; height: 30px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px;
  }
  .badge {
    position: absolute; top: 2px; right: 2px;
    background: #ef4444; color: white; border-radius: 999px;
    font-size: 11px; font-weight: 700; padding: 2px 6px; line-height: 1;
  }
  .panel {
    position: absolute; top: 56px; width: 280px;
    background: white; color: #0f172a;
    border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    overflow: hidden; z-index: 50;
  }
  .panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-bottom: 1px solid #f1f5f9;
    font-size: 13px; font-weight: 600;
  }
  .panel ul { list-style: none; margin: 0; padding: 0; max-height: 280px; overflow-y: auto; }
  .panel li {
    padding: 10px 14px; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; gap: 10px;
    background: #f8fafc; font-size: 13px;
  }
  .panel li.read { background: white; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; }
  .link {
    background: transparent; border: 0; color: #3b82f6;
    cursor: pointer; font-size: 12px; font-weight: 600; padding: 4px 6px;
  }
  .logout {
    background: transparent; border: 0; color: #dc2626;
    cursor: pointer; font-size: 13px; padding: 10px 14px;
    width: 100%; text-align: left;
  }
</style>
