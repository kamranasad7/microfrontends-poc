import { os, ORPCError } from '@orpc/server';
import { LoginInput, LoginOutput, MeOutput, OkOutput } from './schemas';
import { sign, verify } from './jwt';
import { findOrSynthesizeUser } from './users';

type Context = { headers: Headers };

const base = os.$context<Context>();

const authMiddleware = base.middleware(async ({ context, next }) => {
	const auth = context.headers.get('authorization');
	if (!auth || !auth.startsWith('Bearer ')) {
		throw new ORPCError('UNAUTHORIZED', { message: 'Missing bearer token' });
	}
	try {
		const payload = await verify(auth.slice('Bearer '.length));
		const user = findOrSynthesizeUser(payload.sub as string);
		return next({ context: { ...context, user } });
	} catch {
		throw new ORPCError('UNAUTHORIZED', { message: 'Invalid token' });
	}
});

const authed = base.use(authMiddleware);

export const router = {
	login: base
		.input(LoginInput)
		.output(LoginOutput)
		.handler(async ({ input }) => {
			if (input.password.length < 4) {
				throw new ORPCError('UNAUTHORIZED', { message: 'Password too short' });
			}
			const user = findOrSynthesizeUser(input.email);
			const token = await sign({ sub: user.email, name: user.name });
			return { user, token };
		}),
	logout: authed
		.output(OkOutput)
		.handler(async () => ({ ok: true as const })),
	me: authed
		.output(MeOutput)
		.handler(async ({ context }) => ({ user: context.user }))
};

export type AppRouter = typeof router;
