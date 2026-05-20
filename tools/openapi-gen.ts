// Shared OpenAPI spec generator for services/*.
//
// Each microservice imports `writeOpenApiSpec` and calls it once on startup.
// The spec is written to `<serviceDir>/openapi.json` (co-located with the
// service that owns it), kept in sync with the router on every dev restart
// (tsx watch) and on every `generate:openapi` run.
//
// We pin @orpc/openapi + @orpc/zod versions to match the @orpc/server version
// in each service so schema converters stay compatible.

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';

const generator = new OpenAPIGenerator({
	schemaConverters: [new ZodToJsonSchemaConverter()]
});

export interface OpenApiOptions {
	/** Service name; used for the OpenAPI info.title. */
	name: string;
	/** Dev port the service listens on; used to populate `servers`. */
	port: number;
	/** Absolute path to the service's package root. The spec is written to
	 *  `<serviceDir>/openapi.json`. Compute with
	 *  `fileURLToPath(new URL('..', import.meta.url))` from any file in `src/`. */
	serviceDir: string;
	/** Human-readable description for the OpenAPI info block. */
	description?: string;
}

/**
 * Generate the OpenAPI spec for `router` and write it to
 * `<serviceDir>/openapi.json`. Returns the absolute output path.
 */
export async function writeOpenApiSpec(
	// oRPC routers are deeply generic; the generator accepts any shape that
	// matches its internal router type, so we accept `unknown` here and let
	// the generator's runtime checks reject anything invalid.
	router: unknown,
	options: OpenApiOptions
): Promise<string> {
	const spec = await generator.generate(router as never, {
		info: {
			title: `${options.name} microservice`,
			version: '0.0.0',
			...(options.description ? { description: options.description } : {})
		},
		servers: [{ url: `http://localhost:${options.port}/rpc` }]
	});

	const outPath = resolve(options.serviceDir, 'openapi.json');
	await writeFile(outPath, JSON.stringify(spec, null, 2) + '\n', 'utf8');
	return outPath;
}
