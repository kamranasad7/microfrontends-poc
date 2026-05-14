import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { RPCHandler } from '@orpc/server/fetch';
import { router } from './router';
import { allowedOrigins } from '../../../tools/service-env';

const PORT = 4001;
const app = new Hono();

app.use(
	'*',
	cors({
		origin: allowedOrigins(3005),
		credentials: false,
		allowMethods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization']
	})
);

const handler = new RPCHandler(router);

app.all('/rpc/*', async (c) => {
	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: '/rpc',
		context: { headers: c.req.raw.headers }
	});
	return matched ? response : c.notFound();
});

app.get('/health', (c) => c.json({ ok: true, service: 'auth' }));

serve({ fetch: app.fetch, port: PORT }, (info) => {
	console.log(`[auth-microservice] http://localhost:${info.port}`);
});
