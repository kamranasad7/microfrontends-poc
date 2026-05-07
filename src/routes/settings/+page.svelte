<script lang="ts">
	import ReactMFE from '$lib/mfe-adapters/ReactMFE.svelte';
	import { loadSettings } from '$lib/mfe-adapters/loaders';
	import type { SettingsData, SettingsProps } from 'settings/App';

	const props: SettingsProps = {
		userName: 'Kamran',
		userEmail: 'kamran@juicemind.app',
		onSave: (data: SettingsData) =>
			alert('Host received settings save:\n' + JSON.stringify(data, null, 2))
	};
</script>

<ReactMFE load={loadSettings} {props}>
	{#snippet fallback()}
		<div class="loading">Loading settings…</div>
	{/snippet}
</ReactMFE>

<style>
	.loading {
		padding: 24px;
		color: #64748b;
	}
</style>
