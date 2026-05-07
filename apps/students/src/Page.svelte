<script lang="ts">
	interface Student {
		id: number;
		name: string;
		grade: string;
		joined: string;
	}

	interface Props {
		subtitle?: string;
	}

	let { subtitle = 'Federated students remote, mounted in the SvelteKit host.' }: Props = $props();

	const students: Student[] = [
		{ id: 1, name: 'Aisha Khan', grade: '10A', joined: '2024-09-12' },
		{ id: 2, name: 'Marcus Chen', grade: '9B', joined: '2024-09-15' },
		{ id: 3, name: 'Sofia Rodriguez', grade: '10A', joined: '2024-08-30' },
		{ id: 4, name: 'Liam O’Connor', grade: '11C', joined: '2023-09-05' },
		{ id: 5, name: 'Yuki Tanaka', grade: '10B', joined: '2024-09-20' }
	];
</script>

<section>
	<h1>Students MFE</h1>
	<p>{subtitle}</p>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Grade</th>
				<th>Joined</th>
			</tr>
		</thead>
		<tbody>
			{#each students as student (student.id)}
				<tr>
					<td>{student.name}</td>
					<td>{student.grade}</td>
					<td>{student.joined}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style>
	section {
		padding: 24px;
		font-family: system-ui, sans-serif;
	}
	h1 {
		margin: 0;
		color: #16a34a;
	}
	p {
		color: #475569;
	}
	table {
		margin-top: 24px;
		border-collapse: collapse;
		width: 100%;
		max-width: 720px;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 10px;
		overflow: hidden;
	}
	th,
	td {
		padding: 12px 16px;
		text-align: left;
		border-bottom: 1px solid #f1f5f9;
	}
	th {
		background: #f8fafc;
		font-size: 13px;
		color: #475569;
		font-weight: 600;
	}
	tr:last-child td {
		border-bottom: 0;
	}
</style>
