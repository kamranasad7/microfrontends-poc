// auth-store: federated state module owning auth state + JWT.
//
// Federation dedupes exposed modules: every host or remote that does
// `import('auth/Service')` resolves to the SAME instance. The token + user
// state are shared across the Svelte header, React settings, and the auth
// MFE itself.
//
// The wire calls go through ./rpc-client (oRPC, typed against
// services-auth's router). This file owns local cache + pub/sub +
// sessionStorage persistence; the rpc-client owns transport.

import { client, setToken as setRpcToken } from './rpc-client';

export interface AuthUser {
	name: string;
	email: string;
	avatarColor?: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: AuthUser | null;
}

const TOKEN_KEY = 'auth.token';

let state: AuthState = { isAuthenticated: false, user: null };
let token: string | null = null;
const listeners = new Set<(s: AuthState) => void>();

function emit() {
	for (const l of listeners) l(state);
}

function applySession(nextToken: string, user: AuthUser) {
	token = nextToken;
	setRpcToken(nextToken);
	state = { isAuthenticated: true, user };
	if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(TOKEN_KEY, nextToken);
	emit();
}

function clearSession() {
	token = null;
	setRpcToken(null);
	state = { isAuthenticated: false, user: null };
	if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(TOKEN_KEY);
	emit();
}

// Hydrate from sessionStorage on first import. Validates the token with the
// server; clears on 401. Runs once per module instance — federation makes
// that "once per page" across every MFE.
if (typeof sessionStorage !== 'undefined') {
	const stored = sessionStorage.getItem(TOKEN_KEY);
	if (stored) {
		token = stored;
		setRpcToken(stored);
		client
			.me()
			.then(({ user }) => {
				state = { isAuthenticated: true, user };
				emit();
			})
			.catch(() => {
				clearSession();
			});
	}
}

export function getAuthState(): AuthState {
	return state;
}

export function getToken(): string | null {
	return token;
}

export async function login(email: string, password: string): Promise<void> {
	const { user, token: nextToken } = await client.login({ email, password });
	applySession(nextToken, user);
}

export async function logout(): Promise<void> {
	if (token) {
		// Fire-and-forget; server-side logout is a no-op in this POC but the
		// call exists so the contract is honest. Local clear runs regardless.
		client.logout().catch(() => undefined);
	}
	clearSession();
}

export function onAuthChange(cb: (s: AuthState) => void): () => void {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
}
