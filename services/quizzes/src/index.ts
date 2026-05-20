import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { RPCHandler } from '@orpc/server/fastify';
import { router } from './router';
import { allowedOrigins } from '../../../tools/service-env';
import { writeOpenApiSpec } from '../../../tools/openapi-gen';

const PORT = 4002;
const SERVICE_DIR = fileURLToPath(new URL('..', import.meta.url));

// Keep services/quizzes/openapi.json in sync with the router on every dev restart.
await writeOpenApiSpec(router, { name: 'quizzes', port: PORT, serviceDir: SERVICE_DIR });
const app = Fastify({ logger: false });

await app.register(cors, {
	origin: allowedOrigins(3001),
	credentials: false,
	methods: ['GET', 'POST', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
});

const handler = new RPCHandler(router);

app.all('/rpc/*', async (request, reply) => {
	const headers = new Headers();
	for (const [k, v] of Object.entries(request.headers)) {
		if (v == null) continue;
		headers.set(k, Array.isArray(v) ? v.join(',') : String(v));
	}
	const { matched } = await handler.handle(request, reply, {
		prefix: '/rpc',
		context: { headers }
	});
	if (!matched) reply.code(404).send({ error: 'Not found' });
});

app.get('/health', async () => ({ ok: true, service: 'quizzes' }));

await app.listen({ port: PORT, host: '0.0.0.0' });
console.log(`[quizzes-microservice] http://localhost:${PORT}`);
