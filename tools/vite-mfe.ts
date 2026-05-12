// Shared vite-config helpers for every MFE in apps/*. Imported by each
// MFE's vite.config.ts via relative path — this file is NOT a workspace
// package, just a regular .ts module loaded by vite's Node config runtime.

/**
 * Resolves the public URL where this MFE is served. Reads `${NAME}_URL` from
 * process.env, falling back to `http://localhost:${defaultPort}`.
 *
 * Used for two things: the MFE's own `base` (so the production manifest's
 * publicPath is absolute, required for cross-origin asset resolution), and
 * the host's `remotes.<name>.entry` so the host can discover each remote.
 *
 *   const URL = mfeUrl('quizzes', 3001);
 *   // → http://localhost:3001 in dev, or whatever QUIZZES_URL is set to
 */
export function mfeUrl(name: string, defaultPort: number): string {
	const envKey = `${name.toUpperCase()}_URL`;
	return process.env[envKey] ?? `http://localhost:${defaultPort}`;
}

/**
 * Returns a `cssHash` callback for Svelte's compilerOptions, namespacing the
 * scope class by MFE name to prevent cross-MFE CSS collisions.
 *
 * Default Svelte hash is `svelte-${hash(filename)}` — and since every MFE has
 * a similarly-named entry file (e.g. `src/Page.svelte`), the hashes collide
 * across federated boundaries. Namespacing by MFE name fixes that.
 *
 *   svelte({ compilerOptions: { cssHash: cssHashFor('quizzes') } })
 *   // produces classes like `quizzes-qv603g`
 */
export function cssHashFor(name: string) {
	return ({
		hash,
		css,
		filename,
	}: {
		hash: (input: string) => string;
		css: string;
		filename?: string;
	}) => `${name}-${hash(filename ?? css)}`;
}

/**
 * Returns the boilerplate vite config every MFE shares — `base`, `server`,
 * `preview`, `build`. Spread it into the MFE's defineConfig:
 *
 *   export default defineConfig({
 *     ...mfeBase('quizzes', 3001),
 *     plugins: [svelte(...), federation(...)],
 *   });
 *
 * `base` resolves via `mfeUrl(name, port)` — env-driven, defaults to
 * localhost. `server`/`preview` always use `port` since dev servers bind
 * to a local port regardless of public URL.
 */
export function mfeBase(name: string, port: number) {
	const url = mfeUrl(name, port);
	return {
		base: `${url}/`,
		server: { port, strictPort: true, cors: true, origin: url },
		preview: { port, strictPort: true },
		build: {
			target: 'esnext' as const,
			modulePreload: false,
			cssCodeSplit: false,
		},
	};
}
