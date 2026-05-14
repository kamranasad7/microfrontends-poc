import { os, ORPCError } from '@orpc/server';
import { ListOutput } from './schemas';
import { verify } from './jwt';
import { students } from './data';

type Context = { headers: Headers };

const base = os.$context<Context>();

const authMiddleware = base.middleware(async ({ context, next }) => {
	const auth = context.headers.get('authorization');
	if (!auth || !auth.startsWith('Bearer ')) {
		throw new ORPCError('UNAUTHORIZED', { message: 'Missing bearer token' });
	}
	try {
		await verify(auth.slice('Bearer '.length));
		return next();
	} catch {
		throw new ORPCError('UNAUTHORIZED', { message: 'Invalid token' });
	}
});

const authed = base.use(authMiddleware);

export const router = {
	list: authed.output(ListOutput).handler(async () => students)
};

export type AppRouter = typeof router;
