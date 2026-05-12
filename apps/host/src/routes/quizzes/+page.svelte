<script lang="ts">
	import SvelteMFE from '$lib/mfe-adapters/SvelteMFE.svelte';
	import type { QuizzesProps } from 'quizzes/App';

	const load = () => import('quizzes/App');
	const mfeProps: QuizzesProps = { greeting: 'Greetings from the host —' };
</script>

<SvelteMFE {load} props={mfeProps}>
	{#snippet fallback()}
		<div class="loading">Loading quizzes…</div>
	{/snippet}
</SvelteMFE>

<style>
	.loading {
		padding: 24px;
		color: #64748b;
	}
</style>
