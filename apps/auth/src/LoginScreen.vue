<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as Auth from 'header/Service';
import type { AuthState } from 'header/Service';

defineProps<{
	onAuthenticated?: (user: { name: string; email: string }) => void;
}>();

// Mirrors header/Service. The same singleton that Svelte header and React
// settings subscribe to — federation runtime + ESM cache dedupe to one
// module instance across all three frameworks.
const authState = ref<AuthState>(Auth.getAuthState());
let unsubscribe: (() => void) | null = null;

onMounted(() => {
	unsubscribe = Auth.onAuthChange((s) => (authState.value = s));
});

onBeforeUnmount(() => {
	unsubscribe?.();
});

const email = ref('kamran@juicemind.app');
const password = ref('');
const error = ref<string | null>(null);
const submitting = ref(false);

function nameFromEmail(addr: string): string {
	const local = addr.split('@')[0] ?? 'User';
	return local.charAt(0).toUpperCase() + local.slice(1);
}

function colorFromEmail(addr: string): string {
	let hash = 0;
	for (let i = 0; i < addr.length; i++) hash = (hash * 31 + addr.charCodeAt(i)) | 0;
	const hue = ((hash % 360) + 360) % 360;
	return `hsl(${hue} 70% 45%)`;
}

async function handleSubmit() {
	error.value = null;
	if (!email.value.includes('@')) {
		error.value = 'Enter a valid email';
		return;
	}
	if (password.value.length < 4) {
		error.value = 'Password must be at least 4 characters';
		return;
	}
	submitting.value = true;
	// Simulate a network round-trip so the loading state is observable.
	await new Promise((r) => setTimeout(r, 350));
	const user = {
		name: nameFromEmail(email.value),
		email: email.value,
		avatarColor: colorFromEmail(email.value)
	};
	Auth.login(user);
	submitting.value = false;
}
</script>

<template>
	<section class="auth">
		<header>
			<h1>Sign in</h1>
			<p>
				Rendered by the Vue <code>auth</code> MFE, federated into the SvelteKit host.
				It writes to the same <code>header/Service</code> module that the Svelte header
				and React settings consume.
			</p>
		</header>

		<div v-if="authState.isAuthenticated && authState.user" class="signed-in">
			<div
				class="avatar"
				:style="{
					background: `linear-gradient(135deg, ${authState.user.avatarColor ?? '#22c55e'}, #064e3b)`
				}"
			>
				{{ authState.user.name.charAt(0).toUpperCase() }}
			</div>
			<div class="who">
				<div class="name">{{ authState.user.name }}</div>
				<div class="email">{{ authState.user.email }}</div>
			</div>
			<button class="secondary" type="button" @click="Auth.logout()">Sign out</button>
		</div>

		<form v-else class="form" @submit.prevent="handleSubmit">
			<label>
				<span>Email</span>
				<input v-model="email" type="email" autocomplete="username" required />
			</label>
			<label>
				<span>Password</span>
				<input
					v-model="password"
					type="password"
					autocomplete="current-password"
					placeholder="anything 4+ chars"
					required
				/>
			</label>
			<p v-if="error" class="error">{{ error }}</p>
			<button type="submit" :disabled="submitting">
				{{ submitting ? 'Signing in…' : 'Sign in' }}
			</button>
			<p class="hint">
				This is a mock login — no network call. Any email + 4-char password works.
			</p>
		</form>
	</section>
</template>

<style scoped>
.auth {
	max-width: 420px;
	margin: 48px auto;
	padding: 28px 32px;
	background: white;
	border-radius: 14px;
	box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
	font-family: system-ui, sans-serif;
	color: #0f172a;
}
header h1 {
	margin: 0 0 6px;
	font-size: 24px;
}
header p {
	margin: 0 0 24px;
	color: #475569;
	font-size: 13px;
	line-height: 1.55;
}
code {
	background: #f1f5f9;
	padding: 1px 6px;
	border-radius: 4px;
	font-size: 12px;
}
.form {
	display: flex;
	flex-direction: column;
	gap: 14px;
}
label {
	display: flex;
	flex-direction: column;
	gap: 6px;
	font-size: 13px;
	color: #334155;
}
input {
	padding: 9px 12px;
	border: 1px solid #cbd5e1;
	border-radius: 8px;
	font-size: 14px;
	font-family: inherit;
}
input:focus {
	outline: none;
	border-color: #22c55e;
	box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}
button[type='submit'] {
	margin-top: 4px;
	padding: 10px 16px;
	background: #16a34a;
	color: white;
	border: 0;
	border-radius: 8px;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
}
button[type='submit']:disabled {
	background: #94a3b8;
	cursor: not-allowed;
}
button[type='submit']:hover:not(:disabled) {
	background: #15803d;
}
.error {
	margin: 0;
	color: #b91c1c;
	font-size: 13px;
}
.hint {
	margin: 8px 0 0;
	font-size: 12px;
	color: #64748b;
}
.signed-in {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 16px;
	background: #f0fdf4;
	border-radius: 10px;
}
.avatar {
	width: 44px;
	height: 44px;
	border-radius: 50%;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	font-size: 17px;
	flex-shrink: 0;
}
.who {
	flex: 1;
	min-width: 0;
}
.name {
	font-weight: 600;
}
.email {
	font-size: 12px;
	color: #475569;
}
.secondary {
	background: white;
	color: #16a34a;
	border: 1px solid #16a34a;
	padding: 6px 12px;
	border-radius: 6px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
}
.secondary:hover {
	background: #f0fdf4;
}
</style>
