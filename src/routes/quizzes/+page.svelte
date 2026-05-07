<script lang="ts">
	interface Quiz {
		id: number;
		title: string;
		topic: string;
		questions: number;
		durationMin: number;
	}

	const quizzes: Quiz[] = [
		{ id: 1, title: 'Quiz 1', topic: 'Algebra Basics', questions: 12, durationMin: 15 },
		{ id: 2, title: 'Quiz 2', topic: 'World Geography', questions: 20, durationMin: 25 },
		{ id: 3, title: 'Quiz 3', topic: 'JavaScript Fundamentals', questions: 15, durationMin: 20 },
		{ id: 4, title: 'Quiz 4', topic: 'Biology 101', questions: 10, durationMin: 12 },
		{ id: 5, title: 'Quiz 5', topic: 'Modern History', questions: 18, durationMin: 22 },
		{ id: 6, title: 'Quiz 6', topic: 'Chemistry Essentials', questions: 14, durationMin: 18 }
	];
</script>

<section>
	<h1>Quizzes</h1>
	<div class="grid">
		{#each quizzes as quiz (quiz.id)}
			<article>
				<div class="badge">Q{quiz.id}</div>
				<h3>{quiz.title}</h3>
				<div class="topic">{quiz.topic}</div>
				<div class="meta">
					<span>{quiz.questions} questions</span>
					<span class="dot">•</span>
					<span>{quiz.durationMin} min</span>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	section {
		padding: 24px;
	}
	h1 {
		margin: 0;
		color: #2563eb;
	}
	.grid {
		margin-top: 24px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 16px;
	}
	article {
		background: white;
		border: 1px solid #e2e8f0;
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
		color: #0f172a;
	}
	.topic {
		margin-top: 4px;
		font-size: 13px;
		color: #64748b;
	}
	.meta {
		margin-top: 12px;
		display: flex;
		gap: 12px;
		font-size: 12px;
		color: #475569;
	}
	.dot {
		color: #cbd5e1;
	}
</style>
