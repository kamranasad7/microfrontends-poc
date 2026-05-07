<script lang="ts">
	import SvelteMFE from '$lib/mfe-adapters/SvelteMFE.svelte';
	import type { QuizzesProps } from 'quizzes/App';

	const loadQuizzes = () => import('quizzes/App');

	const props: QuizzesProps = { greeting: 'Greetings from the host —' };
</script>

<SvelteMFE load={loadQuizzes} {props}>
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
