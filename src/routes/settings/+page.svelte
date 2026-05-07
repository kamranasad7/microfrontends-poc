<script lang="ts">
	type Theme = 'light' | 'dark';
	type Language = 'en' | 'es' | 'fr';

	let theme = $state<Theme>('light');
	let language = $state<Language>('en');
	let notifications = $state(true);

	function save() {
		alert('Saved:\n' + JSON.stringify({ theme, language, notifications }, null, 2));
	}
</script>

<section>
	<h1>Settings</h1>

	<div class="row">
		<label for="theme">Theme</label>
		<select id="theme" bind:value={theme}>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</div>

	<div class="row">
		<label for="language">Language</label>
		<select id="language" bind:value={language}>
			<option value="en">English</option>
			<option value="es">Español</option>
			<option value="fr">Français</option>
		</select>
	</div>

	<div class="row">
		<label for="notif">Notifications</label>
		<input id="notif" type="checkbox" bind:checked={notifications} />
	</div>

	<button type="button" onclick={save}>Save</button>
</section>

<style>
	section {
		padding: 24px;
		max-width: 520px;
	}
	h1 {
		margin: 0;
		color: #7c3aed;
	}
	.row {
		margin-top: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	label {
		color: #334155;
		font-size: 14px;
	}
	select {
		padding: 6px 10px;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		background: white;
	}
	button {
		margin-top: 24px;
		padding: 10px 18px;
		background: #7c3aed;
		color: white;
		border: 0;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
	}
	button:hover {
		background: #6d28d9;
	}
</style>
