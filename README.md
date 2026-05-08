# JuiceMind Microfrontend POC — `sveltekit-host`

SvelteKit host consuming federated **Svelte** and **React** microfrontends via Module Federation 2.0. Single render-function contract, framework-agnostic at the integration boundary.

## Stack

- **Host** — SvelteKit 2.57 + Svelte 5.55 + Vite 8 + adapter-node 5.5
- **Remotes** — `@module-federation/vite` 1.15
  - `apps/header` — Svelte 5 — `:3003`
  - `apps/quizzes` — Svelte 5 — `:3001`
  - `apps/students` — Svelte 5 — `:3002`
  - `apps/settings` — React 19 — `:3004`
- pnpm workspaces

## The contract

Every MFE exposes a render function from `./App`:

```ts
export function render(target: HTMLElement, props: P): () => void
```

That's it. Cleanup on unmount. The host's adapter (`SvelteMFE.svelte` / `ReactMFE.svelte`) binds a `<div>` ref, calls `render` in `onMount`, returns the cleanup. Both adapters are ~30 lines. The host never knows whether the module behind the contract is Svelte or React.

## Architecture

```
SvelteKit host (:5173)
├── layout            <SvelteMFE load=header>          → header   (:3003)
├── /                 home blurb (SK-native)
├── /quizzes          <SvelteMFE load=quizzes>         → quizzes  (:3001)
├── /students         <SvelteMFE load=students>        → students (:3002)
└── /settings         <ReactMFE  load=settings>        → settings (:3004)
```

The header lives in `+layout.svelte`, so it mounts once and persists across navigation (verified — same DOM node survives route changes).

## Cross-MFE service modules

`apps/header` exposes a second module — `./Service` — a pure-TS auth state file with `logout()`, `login()`, `onAuthChange(cb)`. The settings MFE (React) imports `header/Service` and subscribes. Clicking *Sign out* in the React panel flips the Svelte header's avatar to *Sign in* instantly. Federation dedupes — both consumers get the same module instance.

This is the pattern for any cross-cutting concern (auth, analytics, feature flags, i18n): the owning MFE exposes a service module alongside its UI exposes; consumers stay framework-agnostic.

## File layout

```
microfrontend-poc/
├── src/                              SvelteKit host
│   ├── lib/mfe-adapters/
│   │   ├── SvelteMFE.svelte          mounts any render-fn remote
│   │   ├── ReactMFE.svelte           same + plugin-react preamble shim
│   │   └── react-refresh-shim.ts     idempotent helper
│   └── routes/
│       ├── +layout.svelte            shell + federated header
│       └── <route>/
│           ├── +page.ts              ssr=false + load() fires the import
│           └── +page.svelte          mounts SvelteMFE / ReactMFE
├── apps/
│   ├── header/                       Svelte remote (UI + Service)
│   ├── quizzes/                      Svelte remote
│   ├── students/                     Svelte remote
│   └── settings/                     React remote
├── vite.config.ts                    host federation config
└── svelte.config.js                  SK config (adapter-node)
```

## Dev

```
pnpm install
pnpm dev:all          # all 5 dev servers in one terminal, prefixed output
```

Or individually: `pnpm dev` (host on `:5173`), `pnpm --filter <name> dev` per remote.

## Build & run prod

```
pnpm -r --include-workspace-root build
PORT=5173 node build/index.js                 # host
pnpm --filter <name> preview                  # each remote (or static-serve dist/)
```

Each remote emits `dist/{mf-manifest.json, remoteEntry.js, @mf-types.zip}` — the deploy contract from `cicd-plan.md`.

## Hover preload

Each MFE route's `+page.ts` does a side-effect-only federated import inside `load()`. SK runs `load()` on link hover, the dynamic import warms the browser cache, and click navigation finds the module already settled — no fallback flash.

Notable: settings's `+page.ts` deliberately **doesn't `await`** the import. Settings's `mf-manifest.json` declares a nested remote (header — the Service consumer), and awaiting that nested-remote registration deadlocks SK's hover-preload context. Fire-and-forget keeps SK's preload synchronous; the federation handshake completes in the background.

## Known limitations / deferred work

Documented and non-blocking — POC is functional production-built end-to-end without resolving these. Roughly by priority:

- **Singleton svelte sharing is disabled in production.** With `shared: { svelte: { singleton: true } }` set, the prod bundle throws `TypeError: Cannot read properties of undefined (reading '__esModule')` at startup — looks like an init-order bug in `@module-federation/vite`. Disabling sharing makes each Svelte remote ship its own runtime (~30–50 KB raw / ~10–15 KB gzipped extra per remote). Dev DX is unaffected. **Optimization, not a correctness issue** — federation, the render contract, and the cross-MFE service module all work without sharing. Worth chasing later for the bundle-size savings.

- **Remote URLs hardcoded to `localhost:300X`.** Each `apps/*/vite.config.ts` sets `base: 'http://localhost:300X/'` (so the production manifest's `publicPath` is absolute — required for cross-origin asset resolution). The host's `vite.config.ts` `remotes:` block has the same URLs. For real deploys all of these need to come from env vars.

- **No error boundary around `mod.render()`.** A remote that throws during render takes down the host shell. ~10 lines of try/catch + fallback in each adapter.

- **No CI.** Type check is `pnpm check` for the host + per-app `tsc --noEmit`; no GitHub Action wiring it up yet.

- **`pnpm check` warns about overriding tsconfig `paths`.** Intentional — we use TS-only `paths` for federated remote types so they don't leak into Vite's resolver (`kit.alias` would intercept the bare specifier and break MF's `resolveId` hook). Reasoning is documented inline in `tsconfig.json`.

## Why this branch

This is the cleanest stack so far compared to `react-modern` (Modern.js + Rspack), `react-vite` (React + Vite), and `svelte-vike` (Vike + Svelte). The SvelteKit host gets layout persistence, dev-mode CSS, and route preloading right out of the box — three things we hand-rolled (and partially hacked around) on the Vike branch.

## Hooks

`.claude/hooks/check-package-json.mjs` is a Claude Code `PreToolUse` hook that blocks any `Write|Edit` of a `package.json` unless every dependency was queried with `pnpm view <pkg>` somewhere in the conversation. Enforces the "pin latest stable that peers allow" rule at the tool layer.
