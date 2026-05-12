<section>
	<h1>JuiceMind Quizzes</h1>
	<p>
		Pick a microfrontend from the sidebar. The header above is also a federated
		remote — it stays mounted across navigation.
	</p>
	<p>
		Host is <strong>SvelteKit + Vite 8</strong>. <code>quizzes</code>,
		<code>students</code>, <code>header</code> are <strong>Svelte 5</strong> remotes
		with singleton-shared svelte; <code>settings</code> is a <strong>React 19</strong>
		remote. All federated via <code>@module-federation/vite</code> with a
		framework-agnostic render-function contract.
	</p>
</section>

<style>
	section {
		padding: 24px;
	}
	h1 {
		margin: 0;
	}
	p {
		color: #475569;
	}
	code {
		background: #f1f5f9;
		padding: 1px 6px;
		border-radius: 4px;
		font-size: 0.9em;
	}
</style>
