import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { RPCHandler } from '@orpc/server/node';
import { router } from './router';
import { allowedOrigins } from '../../../tools/service-env';
import { writeOpenApiSpec } from '../../../tools/openapi-gen';

const PORT = 4003;
const SERVICE_DIR = fileURLToPath(new URL('..', import.meta.url));

// Keep services/students/openapi.json in sync with the router on every dev restart.
await writeOpenApiSpec(router, { name: 'students', port: PORT, serviceDir: SERVICE_DIR });
const app = express();

app.use(
	cors({
		origin: allowedOrigins(3002),
		credentials: false,
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization']
	})
);

const handler = new RPCHandler(router);

app.all('/rpc/*splat', async (req: Request, res: Response) => {
	const headers = new Headers();
	for (const [k, v] of Object.entries(req.headers)) {
		if (v == null) continue;
		headers.set(k, Array.isArray(v) ? v.join(',') : String(v));
	}
	const { matched } = await handler.handle(req, res, {
		prefix: '/rpc',
		context: { headers }
	});
	if (!matched) res.status(404).json({ error: 'Not found' });
});

app.get('/health', (_req: Request, res: Response) => {
	res.json({ ok: true, service: 'students' });
});

app.listen(PORT, () => {
	console.log(`[students-microservice] http://localhost:${PORT}`);
});
