// One-shot OpenAPI spec generator. Run via `pnpm --filter services-quizzes
// run generate:openapi`. Boots no server — just writes services/quizzes/openapi.json.

import { fileURLToPath } from 'node:url';
import { router } from './router';
import { writeOpenApiSpec } from '../../../tools/openapi-gen';

const SERVICE_DIR = fileURLToPath(new URL('..', import.meta.url));
const out = await writeOpenApiSpec(router, {
	name: 'quizzes',
	port: 4002,
	serviceDir: SERVICE_DIR
});
console.log(`[quizzes] wrote ${out}`);
