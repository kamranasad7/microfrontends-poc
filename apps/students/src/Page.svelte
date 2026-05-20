<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from './api';
	import { getAuthState, onAuthChange } from 'auth/Service';

	interface Student {
		id: string;
		name: string;
		grade: string;
		enrolledAt: string;
	}

	interface Props {
		subtitle?: string;
	}

	let {
		subtitle = 'Federated students remote, calling its own students-microservice (Express + oRPC).'
	}: Props = $props();

	let students = $state<Student[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let authed = $state(getAuthState().isAuthenticated);

	async function fetchStudents() {
		loading = true;
		error = null;
		try {
			students = await client.list();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load students';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (authed) fetchStudents();
		return onAuthChange((s) => {
			authed = s.isAuthenticated;
			if (s.isAuthenticated) fetchStudents();
			else students = [];
		});
	});
</script>

<section>
	<h1>Students MFE</h1>
	<p>{subtitle}</p>

	{#if !authed}
		<div class="empty">
			<p>You need to <a href="/auth">sign in</a> to view students.</p>
		</div>
	{:else if loading && students.length === 0}
		<div class="empty">Loading students…</div>
	{:else if error}
		<div class="empty error">Error: {error}</div>
	{:else if students.length === 0}
		<div class="empty">No students yet.</div>
	{:else}
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Grade</th>
					<th>Enrolled</th>
				</tr>
			</thead>
			<tbody>
				{#each students as student (student.id)}
					<tr>
						<td>{student.name}</td>
						<td>{student.grade}</td>
						<td>{student.enrolledAt}</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
		color: #16a34a;
	}
	p {
		color: var(--text-muted);
	}
	a {
		color: #16a34a;
		font-weight: 600;
	}
	table {
		margin-top: 24px;
		border-collapse: collapse;
		width: 100%;
		max-width: 720px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
		color: var(--text-primary);
	}
	th,
	td {
		padding: 12px 16px;
		text-align: left;
		border-bottom: 1px solid var(--border);
	}
	th {
		background: var(--bg-muted);
		font-size: 13px;
		color: var(--text-muted);
		font-weight: 600;
	}
	tr:last-child td {
		border-bottom: 0;
	}
	.empty {
		margin-top: 24px;
		padding: 24px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		color: var(--text-muted);
		text-align: center;
		max-width: 720px;
	}
	.empty.error {
		color: #b91c1c;
		border-color: #fecaca;
		background: #fef2f2;
	}
</style>
