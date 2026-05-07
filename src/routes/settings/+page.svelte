<script lang="ts">
	import ReactMFE from '$lib/mfe-adapters/ReactMFE.svelte';
	import type { SettingsData, SettingsProps } from 'settings/App';

	const load = () => import('settings/App');

	const mfeProps: SettingsProps = {
		onSave: (saved: SettingsData) =>
			alert('Host received settings save:\n' + JSON.stringify(saved, null, 2))
	};
</script>

<ReactMFE {load} props={mfeProps}>
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
