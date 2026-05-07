<script lang="ts">
	import SvelteMFE from '$lib/mfe-adapters/SvelteMFE.svelte';
	import type { StudentsProps } from 'students/App';

	const loadStudents = () => import('students/App');

	const props: StudentsProps = {};
</script>

<SvelteMFE load={loadStudents} {props}>
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
