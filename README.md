# JuiceMind Microfrontend POC — `sveltekit-host`

SvelteKit host consuming federated **Svelte**, **React**, and **Vue** microfrontends, each calling its own independent **microservice** (Hono, Fastify, Express) over **oRPC**. Single render-function contract on the UI side, single JWT contract on the wire — both framework-agnostic.

## Module vocabulary

Every module in the repo is tagged by **type**. Domains (e.g. "auth") are a logical grouping; modules in a domain talk to each other through clearly-defined contracts.

| Tag | Where it lives | Example | Role |
|---|---|---|---|
| `microfrontend` | `apps/<name>/` | `apps/auth` (Vue) | Federated UI bundle. Renders something. |
| `store` | inside an MFE package, exposed via federation | `apps/auth/src/Service.ts` (exposed as `auth/Service`) | Plain-TS shared-state module — getters/mutators/subscribers. Same role as Pinia/Zustand, framework-agnostic, deduplicated to one instance across all MFEs by federation. |
| `microservice` | `services/<name>/` | `services/auth` (Hono + oRPC) | Independent HTTP server. Source of truth. Deploys independently. |
| `host` | `apps/host/` | `apps/host` | SvelteKit shell. Loads MFEs via federation; no business logic. |

A `store` physically ships inside its owning MFE bundle today, but it's a distinct **logical** module — a different team could own it, and it could be lifted into its own package later without changing its consumers.

## Stack

- **Host** — SvelteKit 2.57 + Svelte 5.55 + Vite 8 + adapter-node 5.5
- **Microfrontends** — `@module-federation/vite` 1.15
  - `apps/header` — Svelte 5 — `:3003`
  - `apps/quizzes` — Svelte 5 — `:3001`
  - `apps/students` — Svelte 5 — `:3002`
  - `apps/settings` — React 19 — `:3004`
  - `apps/auth` — Vue 3.5 — `:3005`
- **Microservices** — oRPC 1.14 + Zod 4 + HS256 JWT (`jose`)
  - `services/auth` — Hono — `:4001`
  - `services/quizzes` — Fastify — `:4002`
  - `services/students` — Express — `:4003`
- pnpm workspaces

## The contract

Every MFE exposes a render function from `./App`:

```ts
export function render(target: HTMLElement, props: P): () => void
```

That's it. Cleanup on unmount. The host's adapter (`SvelteMFE.svelte` / `ReactMFE.svelte` / `VueMFE.svelte`) binds a `<div>` ref, calls `render` in `onMount`, returns the cleanup. Each adapter is ~30 lines. The host never knows whether the module behind the contract is Svelte, React, or Vue.

## Architecture

```
Browser                                                Node services
─────────────────────────────────────────────────      ─────────────────────────────
SvelteKit host (:5173)
├── layout    <SvelteMFE load=header>   → header   (:3003) ─┐
├── /         home blurb (SK-native)                        │
├── /quizzes  <SvelteMFE load=quizzes>  → quizzes  (:3001) ─┼─→ services/quizzes  (:4002, Fastify + oRPC)
├── /students <SvelteMFE load=students> → students (:3002) ─┼─→ services/students (:4003, Express + oRPC)
├── /settings <ReactMFE  load=settings> → settings (:3004) ─┤
└── /auth     <VueMFE    load=auth>     → auth     (:3005) ─┴─→ services/auth     (:4001, Hono + oRPC)

   federation runtime + render-function contract       ←  oRPC clients use JWT from auth-store  →
```

The header lives in `+layout.svelte`, so it mounts once and persists across navigation. The federated `auth/Service` store holds the JWT in memory + sessionStorage; every MFE's oRPC client pulls the token from there via `getToken()`, so login from the Vue screen authorizes the Svelte quizzes MFE's next fetch automatically.

## Cross-MFE stores

Stores are federated, framework-agnostic modules that the MFEs subscribe to for shared state:

- **`auth/Service`** — owned by the Vue auth MFE. Wraps `services/auth` (oRPC). API: `getAuthState()`, `login(email, password)`, `logout()`, `getToken()`, `onAuthChange(cb)`. Consumed by the Svelte header (Sign-in / Log-out), React settings (account card), and every other MFE's oRPC client (for the `Authorization` header).
- **`header/Service`** — owned by the Svelte header MFE. In-memory notifications: `getNotifications()`, `addNotification(text)`, `dismissNotification(id)`, `markAllRead()`, `onNotificationsChange(cb)`. React settings's Save button pushes a notification; the header bell badge reads the count. Local-only for now; not yet wired to a notifications-microservice.

Signing in from Vue posts to `services/auth`, the JWT lands in `auth-store`, and the Svelte header + React settings rerender from the federated state change. The Svelte quizzes and students MFEs then use the same token (via `getToken()`) for their next backend call.

This is the pattern for any cross-cutting concern (auth, analytics, feature flags, i18n): the owning MFE exposes a store alongside its UI; consumers stay framework-agnostic.

## Services (oRPC backends)

Three independent HTTP servers, each on its own port and in its own server framework, all sharing the same JWT secret so any service can validate a token issued by `services/auth`.

| Service | Port | Framework | oRPC procedures | Auth |
|---|---|---|---|---|
| `services/auth` | 4001 | **Hono** + `@hono/node-server` | `login`, `logout`, `me` | `login` public; others Bearer |
| `services/quizzes` | 4002 | **Fastify** | `list`, `get` | Bearer |
| `services/students` | 4003 | **Express** | `list` | Bearer |

Each service:

- Defines its router in `src/router.ts` and exports `AppRouter` as a TypeScript type.
- Validates inputs/outputs with Zod schemas in `src/schemas.ts`.
- Verifies JWTs with `jose` against the shared `JWT_SECRET` env var (dev default in `tools/service-env.ts`).
- Mounts CORS via env-driven `ALLOWED_ORIGINS` (defaults: SvelteKit host + the primary MFE's standalone dev origin).

MFEs consume each service through a tiny oRPC client (`apps/<name>/src/api.ts` or `rpc-client.ts`). The client imports the `AppRouter` type from the corresponding `services-<name>` workspace package (type-only — never bundled at runtime) and pulls the token from `auth-store`:

```ts
// apps/quizzes/src/api.ts (simplified)
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { AppRouter } from 'services-quizzes/router';
import { getToken } from 'auth/Service';

const link = new RPCLink({
  url: `${import.meta.env.VITE_QUIZZES_API_URL ?? 'http://localhost:4002'}/rpc`,
  headers: () => {
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
});

export const client = createORPCClient<AppRouter>(link);
```

End-to-end types: changing a procedure's Zod output in `services/quizzes/src/schemas.ts` immediately surfaces a type error in `apps/quizzes/src/Page.svelte` on the next typecheck.

## File layout

Pure monorepo — `apps/*` for microfrontends + host, `services/*` for microservices. Shared helpers in `tools/`.

```
microfrontend-poc/
├── apps/
│   ├── host/                         SvelteKit host
│   │   ├── src/
│   │   │   ├── lib/mfe-adapters/
│   │   │   │   ├── SvelteMFE.svelte           mounts any render-fn remote
│   │   │   │   ├── ReactMFE.svelte            same + plugin-react preamble shim
│   │   │   │   ├── VueMFE.svelte              same shape as SvelteMFE
│   │   │   │   └── react-refresh-shim.ts      idempotent helper
│   │   │   └── routes/
│   │   │       ├── +layout.svelte             shell + federated header
│   │   │       └── <route>/
│   │   │           ├── +page.ts               ssr=false + load() fires the import
│   │   │           └── +page.svelte           mounts SvelteMFE / ReactMFE / VueMFE
│   │   ├── vite.config.ts                     host federation config
│   │   ├── svelte.config.js                   SK config (adapter-node)
│   │   └── package.json
│   ├── header/                       Svelte microfrontend (+ notifications store)
│   ├── quizzes/                      Svelte microfrontend
│   ├── students/                     Svelte microfrontend
│   ├── settings/                     React microfrontend
│   └── auth/                         Vue microfrontend (+ auth store)
├── services/
│   ├── auth/                         Hono + oRPC
│   │   └── src/{index,router,schemas,jwt,users}.ts
│   ├── quizzes/                      Fastify + oRPC
│   └── students/                     Express + oRPC
├── tools/
│   ├── vite-mfe.ts                   mfeBase / mfeUrl / cssHashFor helpers
│   ├── service-env.ts                serviceUrl / allowedOrigins / jwtSecret
│   └── package.json                  type: module marker for ESM imports
├── package.json                      workspace root — orchestration scripts only
├── pnpm-workspace.yaml               packages: [apps/*, services/*]
└── README.md
```

## Dev

```
pnpm install
pnpm dev:all          # all 9 dev servers in one terminal, prefixed output
```

That's 1 host + 5 MFEs + 3 microservices. Or individually: `pnpm dev:host` (host on `:5173`), `pnpm --filter <name> dev` per app or service.

If anything stalls during initial cold start, kick the dependent processes in this order: services first (so they can publish types), then MFEs (so the host can pull `@mf-types`), then the host.

## Build & run prod

```
pnpm build                                    # all apps via pnpm -r
PORT=5173 node apps/host/build/index.js       # host (adapter-node output)
pnpm --filter <name> preview                  # each remote
```

Each remote emits `dist/{mf-manifest.json, remoteEntry.js, @mf-types.zip}` — the deploy contract from `cicd-plan.md`.

## Hover preload

Quizzes / students / header routes' `+page.ts` each `await import('<remote>/App')` inside `load()`. SK runs `load()` on link hover, the dynamic import warms the browser cache, click finds the module already settled — no fallback flash.

Quizzes, students, settings, and auth all declare nested federation remotes (every MFE that talks to a microservice needs `auth` as a nested remote to grab the JWT from `auth-store`). With nested remotes the federation runtime can't reconcile its handshake inside SK's hover-preload window, so those four routes' `+page.ts` are intentionally `ssr=false` only, no `load()`. Click navigation still works because the page lifecycle gives the handshake more time — just no instant-feel hover-preload. Only the layout-mounted `header` MFE escapes this trade-off.

## CSS strategy — federated

Component-scoped styles aren't auto-isolated across federated boundaries. Svelte's default `cssHash` is `svelte-${hash(filename)}` — and **two MFEs with the same relative file path (`src/Page.svelte`) generate the same scope class**. CSS rules from a different MFE end up matching elements in this MFE; the second-loaded rule wins. Symptom: hover Quizzes link → Students's CSS preloads → Quizzes title turns green.

Fix lives in `tools/vite-mfe.ts` as `cssHashFor(name)`, used by every Svelte MFE:

```ts
import { cssHashFor, mfeBase } from '../../tools/vite-mfe';

const NAME = 'quizzes';
const PORT = 3001;

export default defineConfig({
  ...mfeBase(PORT),
  plugins: [
    svelte({ compilerOptions: { cssHash: cssHashFor(NAME) } }),
    federation({ name: NAME, ... }),
  ],
});
```

`cssHashFor('quizzes')` returns a function that produces `quizzes-${hash(filename)}` — per-MFE namespace, no `svelte-` prefix needed since the MFE name already disambiguates. Classes look like `quizzes-qv603g`, `students-qv603g`, `header-qv603g` — collision impossible.

**For Tailwind (which this stack will use):** Tailwind classes are global by design — `bg-blue-500` is the same rule everywhere, so cross-MFE "collisions" are benign (same rule on both sides). The real cost is **shipping Tailwind's base layer once per MFE** (each MFE bundles its own `@tailwind base/components/utilities` output). Two reasonable strategies:

1. **Each MFE bundles its own Tailwind.** Simplest. Adds ~10–15 KB gzipped of duplicated base per MFE. Total tolerable for 4–5 MFEs; gets expensive at 20+.
2. **Shared design-system package** (e.g. `packages/ui-tokens`) owns the Tailwind config + a single built CSS bundle that the host loads at `+layout.svelte`. MFEs use the classes without bundling their own base. Lower total CSS, but introduces a shared workspace dep — every MFE must align on the Tailwind version + config.

Either way, **component-scoped styles still need per-MFE `cssHash` namespacing** to avoid collisions with similarly-named files. Tailwind solves the design-system layer; it doesn't solve scope-hash collisions in Svelte components.

## Known traps

Hit during this POC; documented so the next person doesn't have to.

- **Don't put `import('<remote>/App')` syntax inside JS comments.** `@module-federation/vite`'s source transform is not comment-aware — it matches the literal `import(...)` text inside comments and rewrites it as real code, which silently corrupts the bootstrap chain (no error, the hover-preload graph just stalls partway). Symptom: federated route loads fine on click but never preloads on hover. Found this for both `apps/host/src/routes/quizzes/+page.ts` and `settings/+page.ts` earlier — a comment containing the dynamic-import string broke preload.

- **Svelte scope-hash collision across MFEs**, fixed via per-MFE `cssHash` (see *CSS strategy — federated* above).

## Known limitations / deferred work

Documented and non-blocking. Roughly by priority:

- **In-memory backends.** Every microservice keeps state in module-level variables. Restart wipes data. Demonstrates the federation + auth flow without DB plumbing. Real fix: SQLite + Drizzle per service, or shared Postgres.

- **Single 1 h JWT, no refresh.** Token in `sessionStorage`. Real fix: refresh tokens + HttpOnly cookies via a BFF on the host (we deliberately picked direct browser → service for this POC).

- **`header/Service` notifications are still in-memory in the browser** — there is no `services/notifications` yet. The bell + dropdown work as a local store; a notifications-microservice would be the next iteration.

- **CORS is permissive in dev.** Each service allows `localhost:5173` + its primary MFE's standalone origin. Prod allowlists drive from `ALLOWED_ORIGINS` env.

- **Singleton svelte sharing is disabled in production.** With `shared: { svelte: { singleton: true } }` set, the prod bundle throws `TypeError: Cannot read properties of undefined (reading '__esModule')` at startup — looks like an init-order bug in `@module-federation/vite`. Disabling sharing makes each Svelte remote ship its own runtime (~30–50 KB raw / ~10–15 KB gzipped extra per remote). Dev DX is unaffected.

- **No error boundary around `mod.render()`.** A remote that throws during render takes down the host shell. ~10 lines of try/catch + fallback in each adapter.

- **No CI.** Type check is `pnpm check` for the host + per-app `tsc --noEmit`; no GitHub Action wiring it up yet.

- **`pnpm check` warns about overriding tsconfig `paths`.** Intentional — we use TS-only `paths` for federated remote types so they don't leak into Vite's resolver (`kit.alias` would intercept the bare specifier and break MF's `resolveId` hook). Reasoning is documented inline in `tsconfig.json`.

## Why this branch

This is the cleanest stack so far compared to `react-modern` (Modern.js + Rspack), `react-vite` (React + Vite), and `svelte-vike` (Vike + Svelte). The SvelteKit host gets layout persistence, dev-mode CSS, and route preloading right out of the box — three things we hand-rolled (and partially hacked around) on the Vike branch.

## Hooks

`.claude/hooks/check-package-json.mjs` is a Claude Code `PreToolUse` hook that blocks any `Write|Edit` of a `package.json` unless every dependency was queried with `pnpm view <pkg>` somewhere in the conversation. Enforces the "pin latest stable that peers allow" rule at the tool layer.
