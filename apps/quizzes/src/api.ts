import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from 'services-quizzes/router';
import { getToken } from 'auth/Service';

const link = new RPCLink({
	url: `${import.meta.env.VITE_QUIZZES_API_URL ?? 'http://localhost:4002'}/rpc`,
	headers: () => {
		const t = getToken();
		return t ? { Authorization: `Bearer ${t}` } : {};
	}
});

export const client: RouterClient<AppRouter> = createORPCClient(link);
