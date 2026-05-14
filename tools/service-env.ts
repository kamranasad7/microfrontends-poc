// Shared env helpers for services/* and the MFEs that consume them.
//
// Service URL convention: each microservice reads `${NAME}_API_URL` from
// process.env, falling back to `http://localhost:${defaultPort}`. Mirrors
// `mfeUrl` in tools/vite-mfe.ts so the two halves of the system follow the
// same env contract.

export function serviceUrl(name: string, defaultPort: number): string {
	const envKey = `${name.toUpperCase()}_API_URL`;
	return process.env[envKey] ?? `http://localhost:${defaultPort}`;
}

/**
 * CORS allowlist for a microservice. Reads `ALLOWED_ORIGINS` (comma-separated)
 * if set, otherwise returns the dev defaults: SvelteKit host (5173) + the
 * MFE's standalone dev origin so `pnpm --filter <mfe> dev` works against a
 * running service.
 */
export function allowedOrigins(mfeStandalonePort?: number): string[] {
	const env = process.env.ALLOWED_ORIGINS;
	if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
	const defaults = ['http://localhost:5173'];
	if (mfeStandalonePort) defaults.push(`http://localhost:${mfeStandalonePort}`);
	return defaults;
}

/**
 * Shared JWT secret. HS256 with a dev default; in any non-trivial deploy you
 * MUST set JWT_SECRET to a real random string. All microservices read this so
 * tokens issued by auth-microservice are verifiable everywhere.
 */
export function jwtSecret(): string {
	return process.env.JWT_SECRET ?? 'dev-secret-change-me-in-prod';
}
