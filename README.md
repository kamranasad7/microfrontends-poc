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

Pure monorepo — host and every remote live as siblings under `apps/*`. The repo root is a thin workspace shell.

```
microfrontend-poc/
├── apps/
│   ├── host/                         SvelteKit host
│   │   ├── src/
│   │   │   ├── lib/mfe-adapters/
│   │   │   │   ├── SvelteMFE.svelte           mounts any render-fn remote
│   │   │   │   ├── ReactMFE.svelte            same + plugin-react preamble shim
│   │   │   │   └── react-refresh-shim.ts      idempotent helper
│   │   │   └── routes/
│   │   │       ├── +layout.svelte             shell + federated header
│   │   │       └── <route>/
│   │   │           ├── +page.ts               ssr=false + load() fires the import
│   │   │           └── +page.svelte           mounts SvelteMFE / ReactMFE
│   │   ├── vite.config.ts                     host federation config
│   │   ├── svelte.config.js                   SK config (adapter-node)
│   │   └── package.json
│   ├── header/                       Svelte remote (UI + Service)
│   ├── quizzes/                      Svelte remote
│   ├── students/                     Svelte remote
│   └── settings/                     React remote
├── package.json                      workspace root — orchestration scripts only
├── pnpm-workspace.yaml               packages: [apps/*]
└── README.md
```

## Dev

```
pnpm install
pnpm dev:all          # all 5 dev servers in one terminal, prefixed output
```

Or individually: `pnpm dev` (host on `:5173`), `pnpm --filter <name> dev` per app.

## Build & run prod

```
pnpm build                                    # all apps via pnpm -r
PORT=5173 node apps/host/build/index.js       # host (adapter-node output)
pnpm --filter <name> preview                  # each remote
```

Each remote emits `dist/{mf-manifest.json, remoteEntry.js, @mf-types.zip}` — the deploy contract from `cicd-plan.md`.

## Hover preload

Quizzes / students / header routes' `+page.ts` each `await import('<remote>/App')` inside `load()`. SK runs `load()` on link hover, the dynamic import warms the browser cache, click finds the module already settled — no fallback flash.

Settings's `+page.ts` is intentionally `ssr=false` only, no `load()`. Its `mf-manifest.json` declares a nested remote (header — the Service consumer), and the federation runtime can't reconcile that nested-remote handshake inside SK's hover-preload window. Click navigation still works because the page lifecycle gives the handshake more time — just no instant-feel hover-preload for `/settings`.

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
