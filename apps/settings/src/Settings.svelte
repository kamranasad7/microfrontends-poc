<script lang="ts">
  import type { SettingsProps, SettingsData } from './App';

  let { userName, userEmail, onSave }: SettingsProps = $props();

  let theme = $state<'light' | 'dark'>('light');
  let language = $state<'en' | 'es' | 'fr'>('en');
  let notifications = $state(true);
  let savedAt = $state<Date | null>(null);

  function save() {
    const data: SettingsData = { theme, language, notifications };
    onSave?.(data);
    savedAt = new Date();
  }
</script>

<section class="settings">
  <header>
    <h1>Settings</h1>
    <span class="badge">rendered by settings MFE (Svelte)</span>
  </header>

  <div class="card">
    <h2>Profile</h2>
    <div class="field">
      <label>Name</label>
      <div class="readonly">{userName}</div>
    </div>
    <div class="field">
      <label>Email</label>
      <div class="readonly">{userEmail}</div>
    </div>
    <p class="hint">Profile values come from props passed by the host.</p>
  </div>

  <div class="card">
    <h2>Preferences</h2>

    <div class="field">
      <label>Theme</label>
      <div class="radio-group">
        <label class="radio">
          <input type="radio" bind:group={theme} value="light" />
          <span>Light</span>
        </label>
        <label class="radio">
          <input type="radio" bind:group={theme} value="dark" />
          <span>Dark</span>
        </label>
      </div>
    </div>

    <div class="field">
      <label for="language">Language</label>
      <select id="language" bind:value={language}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>

    <div class="field">
      <label class="check">
        <input type="checkbox" bind:checked={notifications} />
        <span>Email notifications</span>
      </label>
    </div>
  </div>

  <div class="actions">
    <button type="button" onclick={save}>Save settings</button>
    {#if savedAt}
      <span class="saved">Saved at {savedAt.toLocaleTimeString()}</span>
    {/if}
  </div>
</section>

<style>
  .settings {
    padding: 24px;
    font-family: system-ui, sans-serif;
    color: #0f172a;
    max-width: 720px;
  }
  header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 20px;
  }
  h1 {
    margin: 0;
    color: #f97316;
    font-size: 28px;
  }
  .badge {
    color: #94a3b8;
    font-size: 12px;
  }
  .card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }
  h2 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #0f172a;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }
  .field:last-child {
    margin-bottom: 0;
  }
  .field > label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }
  .readonly {
    padding: 8px 12px;
    background: #f1f5f9;
    border-radius: 6px;
    color: #0f172a;
    font-size: 14px;
  }
  .hint {
    margin: 4px 0 0;
    font-size: 12px;
    color: #94a3b8;
  }
  select {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    max-width: 240px;
  }
  .radio-group {
    display: flex;
    gap: 12px;
  }
  .radio,
  .check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    color: #0f172a;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
  }
  button {
    background: #f97316;
    color: white;
    border: 0;
    padding: 10px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }
  button:hover {
    background: #ea580c;
  }
  .saved {
    color: #16a34a;
    font-size: 13px;
  }
</style>
