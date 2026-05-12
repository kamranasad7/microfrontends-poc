<script lang="ts">
	import SvelteMFE from '$lib/mfe-adapters/SvelteMFE.svelte';
	import type { StudentsProps } from 'students/App';

	const load = () => import('students/App');
	const mfeProps: StudentsProps = {};
</script>

<SvelteMFE {load} props={mfeProps}>
	{#snippet fallback()}
		<div class="loading">Loading students…</div>
	{/snippet}
</SvelteMFE>

<style>
	.loading {
		padding: 24px;
		color: #64748b;
	}
</style>
