// Auth service module exposed by the header MFE.
//
// Federation dedupes exposed modules across consumers — every host or remote
// that does `import('header/Service')` resolves to the SAME module instance
// through MF's runtime. The state below is shared across the host, the
// header MFE itself, and any other remote that imports it. No `shared:`
// config needed; that's only for runtime deps like svelte/react.
//
// Pure TypeScript, no DOM, no framework — so React and Svelte consumers
// can use it interchangeably without dragging a framework runtime through
// the federation boundary.

export interface AuthUser {
	name: string;
	email: string;
	avatarColor?: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: AuthUser | null;
}

const DEFAULT_USER: AuthUser = {
	name: 'Kamran',
	email: 'kamran@juicemind.app',
	avatarColor: '#7c3aed'
};

let state: AuthState = { isAuthenticated: true, user: DEFAULT_USER };
const listeners = new Set<(s: AuthState) => void>();

function emit() {
	for (const l of listeners) l(state);
}

export function getAuthState(): AuthState {
	return state;
}

export function logout(): void {
	if (!state.isAuthenticated) return;
	state = { isAuthenticated: false, user: null };
	emit();
	// Real app: fetch('/api/logout', { method: 'POST' })
}

export function login(user: AuthUser = DEFAULT_USER): void {
	if (state.isAuthenticated) return;
	state = { isAuthenticated: true, user };
	emit();
}

export function onAuthChange(cb: (s: AuthState) => void): () => void {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
}
