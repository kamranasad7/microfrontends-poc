// One-shot OpenAPI spec generator. Run via `pnpm --filter services-students
// run generate:openapi`. Boots no server — just writes services/students/openapi.json.

import { fileURLToPath } from 'node:url';
import { router } from './router';
import { writeOpenApiSpec } from '../../../tools/openapi-gen';

const SERVICE_DIR = fileURLToPath(new URL('..', import.meta.url));
const out = await writeOpenApiSpec(router, {
	name: 'students',
	port: 4003,
	serviceDir: SERVICE_DIR
});
console.log(`[students] wrote ${out}`);
