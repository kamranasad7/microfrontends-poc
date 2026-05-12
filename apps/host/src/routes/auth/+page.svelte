<script lang="ts">
	import VueMFE from '$lib/mfe-adapters/VueMFE.svelte';
	import type { AuthenticatedUser, AuthProps } from 'auth/App';

	const load = () => import('auth/App');
	const mfeProps: AuthProps = {
		onAuthenticated: (user: AuthenticatedUser) =>
			console.log('[host] auth notified login:', user)
	};
</script>

<VueMFE {load} props={mfeProps}>
	{#snippet fallback()}
		<div class="loading">Loading auth…</div>
	{/snippet}
</VueMFE>

<style>
	.loading {
		padding: 24px;
		color: #64748b;
	}
</style>
