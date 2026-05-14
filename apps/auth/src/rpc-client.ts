import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from 'services-auth/router';

// Auth-store owns the token, so the client's auth header is driven by a
// setter the store calls on login/logout. Avoids a circular import between
// Service.ts and rpc-client.ts while keeping the token in one place.
let token: string | null = null;

export function setToken(next: string | null) {
	token = next;
}

const link = new RPCLink({
	url: `${import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:4001'}/rpc`,
	headers: () => (token ? { Authorization: `Bearer ${token}` } : {})
});

export const client: RouterClient<AppRouter> = createORPCClient(link);
