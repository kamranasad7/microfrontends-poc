<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from './api';
	import { getAuthState, onAuthChange } from 'auth/Service';

	interface Quiz {
		id: string;
		title: string;
		subject: string;
		questionCount: number;
		updatedAt: string;
	}

	interface Props {
		greeting?: string;
	}

	let { greeting = '' }: Props = $props();

	let quizzes = $state<Quiz[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let authed = $state(getAuthState().isAuthenticated);

	async function fetchQuizzes() {
		loading = true;
		error = null;
		try {
			quizzes = await client.list();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load quizzes';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (authed) fetchQuizzes();
		return onAuthChange((s) => {
			authed = s.isAuthenticated;
			if (s.isAuthenticated) fetchQuizzes();
			else quizzes = [];
		});
	});

	function formatDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString();
		} catch {
			return iso;
		}
	}
</script>

<section>
	<h1>{greeting} Quizzes MFE</h1>
	<p>
		Federated <code>quizzes</code> remote, calling its own
		<code>quizzes-microservice</code> (Fastify + oRPC) for the data below.
	</p>

	{#if !authed}
		<div class="empty">
			<p>You need to <a href="/auth">sign in</a> to view quizzes.</p>
		</div>
	{:else if loading && quizzes.length === 0}
		<div class="empty">Loading quizzes…</div>
	{:else if error}
		<div class="empty error">Error: {error}</div>
	{:else if quizzes.length === 0}
		<div class="empty">No quizzes yet.</div>
	{:else}
		<div class="grid">
			{#each quizzes as quiz (quiz.id)}
				<article>
					<div class="badge">{quiz.subject.charAt(0)}</div>
					<h3>{quiz.title}</h3>
					<div class="topic">{quiz.subject}</div>
					<div class="meta">
						<span>{quiz.questionCount} questions</span>
						<span class="dot">•</span>
						<span>updated {formatDate(quiz.updatedAt)}</span>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
	section {
		padding: 24px;
		font-family: system-ui, sans-serif;
		color: var(--text-primary);
	}
	h1 {
		margin: 0;
		color: #2563eb;
	}
	p {
		color: var(--text-muted);
	}
	a {
		color: #2563eb;
		font-weight: 600;
	}
	.grid {
		margin-top: 24px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 16px;
	}
	article {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 16px;
		box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
	}
	.badge {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 14px;
		margin-bottom: 12px;
	}
	h3 {
		margin: 0;
		font-size: 16px;
		color: var(--text-primary);
	}
	.topic {
		margin-top: 4px;
		font-size: 13px;
		color: var(--text-muted);
	}
	.meta {
		margin-top: 12px;
		display: flex;
		gap: 12px;
		font-size: 12px;
		color: var(--text-muted);
	}
	.dot {
		color: var(--border-strong);
	}
	.empty {
		margin-top: 24px;
		padding: 24px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		color: var(--text-muted);
		text-align: center;
	}
	.empty.error {
		color: #b91c1c;
		border-color: #fecaca;
		background: #fef2f2;
	}
</style>
