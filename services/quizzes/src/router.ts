import { os, ORPCError } from '@orpc/server';
import { GetInput, ListOutput, QuizSchema } from './schemas';
import { verify } from './jwt';
import { findById, quizzes } from './data';

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
	list: authed.output(ListOutput).handler(async () => quizzes),
	get: authed
		.input(GetInput)
		.output(QuizSchema)
		.handler(async ({ input }) => {
			const found = findById(input.id);
			if (!found) throw new ORPCError('NOT_FOUND', { message: `Quiz ${input.id} not found` });
			return found;
		})
};

export type AppRouter = typeof router;
