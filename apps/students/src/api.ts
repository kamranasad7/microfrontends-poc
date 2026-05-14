import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import type { AppRouter } from 'services-students/router';
import { getToken } from 'auth/Service';

const link = new RPCLink({
	url: `${import.meta.env.VITE_STUDENTS_API_URL ?? 'http://localhost:4003'}/rpc`,
	headers: () => {
		const t = getToken();
		return t ? { Authorization: `Bearer ${t}` } : {};
	}
});

export const client: RouterClient<AppRouter> = createORPCClient(link);
