# MFE Plan 2 — All-Svelte Stack

Alternate to [PLAN.md](PLAN.md). Same constraints (independent deploy, route+component, SSR), different bet: **commit to Svelte everywhere instead of mixing React + Svelte**.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Federation runtime | **Module Federation 2.0** (`@module-federation/vite`) | Mature runtime composition, route + component, runtime remote registration |
| Bundler | **Vite** | First-class Svelte support, MF 2.0 has an official Vite plugin |
| SSR + routing | **Vike** | Vite-native SSR meta-framework, file-based routing, renderer-agnostic but pairs cleanly with Svelte 5 |
| Component framework | **Svelte 5** (with runes) | Compiler-based, tiny runtime, native custom-element support as an escape hatch |
| Package manager | **pnpm + workspaces** | Standard for federation monorepos |
| Repo orchestration | **Turborepo** | Parallel dev/build across host + remotes |
| Language | **TypeScript** + MF 2.0 `dts` plugin | Cross-remote type safety on federated imports |

### Explicitly NOT in the stack
- **SvelteKit** — fights federation, owns too much of the rendering pipeline
- **Webpack/Rspack** — Vite is the canonical Svelte bundler
- **Modern.js** — React-flavored, not relevant here

---

## Architecture

```
host (Vike + Svelte 5, :3000)
├── Vike file-based routes (top-level routing)
├── /shop/*    → mounts remote-shop's exposed ./Routes
├── /admin/*   → mounts remote-admin's exposed ./Routes
└── header     → embeds remote-shop's <CartWidget />

remote-shop (Vike + Svelte 5, :3001) — SSR
└── exposes:
    ├── ./Routes      → route subtree (own internal client-side router)
    └── ./CartWidget  → standalone Svelte component

remote-admin (Vike + Svelte 5, :3002) — SSR
└── exposes:
    ├── ./Routes      → route subtree
    └── ./Dashboard   → standalone component
```

### Dual route+component pattern
Every remote exposes:
1. A **route-shaped** export (`./Routes`) — host mounts under a path
2. A **component-shaped** export (`./Widget`) — host embeds inline

Same pattern as Plan 1, satisfies the "MFE is both" constraint.

### SSR scope — no compromises
Because every MFE is Svelte, **federated SSR works end-to-end**. No "this remote is CSR when embedded" caveat. This is the main reason to go all-Svelte.

---

## Repo Layout

```
mfe-monorepo/
├── package.json              # pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── apps/
│   ├── host/                 # Vike + Svelte 5
│   ├── remote-shop/          # Vike + Svelte 5
│   └── remote-admin/         # Vike + Svelte 5
└── packages/
    └── shared-state/         # cross-MFE Svelte 5 runes-based stores
```

`shared-state` is **not optional** here (unlike Plan 1) — Svelte 5 runes-based stores need a single instance across remotes, otherwise each remote gets its own state.

---

## Key Technical Decisions

1. **Top-level routing:** Vike file-based routing at the host. Federated `./Routes` exports use a small client-side router internally (`svelte-routing` or hand-rolled with runes) since Vike's file-based routing doesn't extend across federation boundaries.
2. **Shared deps:** `svelte` pinned as singleton via MF 2.0 `shared` config. Single dep to coordinate, vs. React + ReactDOM + Router triplet in Plan 1.
3. **Shared state:** put in `packages/shared-state/`, imported by every MFE. Don't define cross-MFE stores per-app.
4. **Type safety:** MF 2.0 `dts` plugin auto-generates `.d.ts` per remote, host gets IntelliSense on federated imports.
5. **Runtime remote registration:** MF 2.0 runtime API, remote URLs swappable per env.
6. **Custom-element escape hatch:** any remote can also expose a Web Component via Svelte 5's `<svelte:options customElement>` — free option for embedding in non-Svelte hosts later.
7. **Error isolation:** host wraps every remote mount in an error boundary.

---

## Critical Files (when implementation begins)

- `apps/host/vite.config.ts` — host MF plugin config, shared deps, runtime remotes
- `apps/host/pages/+config.ts` — Vike config (SSR mode, renderer)
- `apps/host/pages/shop/+Page.svelte` — federated route mount
- `apps/remote-shop/vite.config.ts` — exposes config for `./Routes` and `./CartWidget`
- `packages/shared-state/src/` — cross-MFE Svelte 5 runes stores
- `pnpm-workspace.yaml`, `turbo.json` — monorepo orchestration

---

## Can it host a React MFE?

**Yes — but with the same compromise Plan 1 makes for Svelte.**

You'd add a React remote (Vite + Vike or just Vite + MF 2.0), exposing components federated through MF 2.0. The Svelte host mounts the React remote via a small `ReactIsland.svelte` wrapper that imports the federated React component, creates a DOM node, and calls `createRoot().render()`.

What you lose: that React MFE is **CSR-when-federated**. SSR-through-federation across framework boundaries is bleeding-edge in either direction. So if you add React to Plan 2, you give back the "SSR everywhere" win that was the main reason to pick Plan 2 over Plan 1.

**Net:** Plan 2 *can* be mixed-framework, but mixing it defeats its main advantage. If you know you'll need React eventually, Plan 1 is the better starting point.

---

## Comparison to Plan 1

| Dimension | Plan 1 (mixed) | Plan 2 (all-Svelte) |
|---|---|---|
| **Bundler** | Rspack | Vite |
| **SSR meta-framework** | Modern.js | Vike |
| **Federation** | MF 2.0 (`@module-federation/enhanced`) | MF 2.0 (`@module-federation/vite`) |
| **Host framework** | React 19 + RR7 | Svelte 5 |
| **Remote A** | React (SSR via Modern.js) | Svelte 5 (SSR via Vike) |
| **Remote B** | Svelte 5 + Vite (CSR when federated) | Svelte 5 + Vike (SSR end-to-end) |
| **SSR coverage** | Host + React remote only | Every remote, no compromises |
| **Bundle size** | Heavier (React + RR runtime) | Much smaller (Svelte compiles runtime away) |
| **Shared deps surface** | React + ReactDOM + RR (singleton triplet) | Just `svelte` |
| **Glue code** | `SvelteIsland.tsx` framework bridge | None within Svelte; `ReactIsland.svelte` only if you add React later |
| **Mixed-framework eval** | ✅ explicit goal | ❌ defeats the purpose |
| **Talent pool / hireability** | Large (React) | Smaller (Svelte) |
| **Ecosystem maturity for MF** | Larger — most prod MF deployments are React+Rspack | Smaller — `@module-federation/vite` works well but less battle-tested |
| **State sharing** | Per-MFE; React Context across federation works but limited | Requires `shared-state` package upfront (runes need single instance) |
| **Cross-MFE typing** | MF 2.0 `dts` | MF 2.0 `dts` (same) |
| **Independent deploy** | ✅ | ✅ |
| **Route + component** | ✅ | ✅ |

### When to pick which

- **Pick Plan 1** if: you have or expect to have React apps to fold in, you need the bigger ecosystem/talent pool, or evaluating cross-framework MF is a real goal.
- **Pick Plan 2** if: you're greenfield with no React legacy, you want the smallest bundles + cleanest SSR story, and you're OK with Svelte's smaller ecosystem.

---

## Verification

End-to-end acceptance, run after implementation:

1. **Independent dev:** `pnpm --filter remote-shop dev` runs the remote standalone at :3001, fully usable.
2. **Composed dev:** `turbo dev` brings up all three. Visit host at :3000 — see embedded `CartWidget`, navigate to `/shop` and see federated route, navigate to `/admin` and see the other federated route.
3. **SSR check:** `curl localhost:3000/shop` returns server-rendered HTML containing the remote's content (Plan 2 advantage — this works across the federation boundary, not just for the host).
4. **Type safety:** autocomplete on `import('remote-shop/CartWidget')` in the host.
5. **Independent deploy simulation:** build each app, serve from separate static servers, point host's runtime URL at them, verify everything works.
6. **Error isolation:** kill a remote's server, host still loads, fallbacks render.
7. **Shared state:** mutate a runes store from one remote, observe the change in another remote rendered on the same host page.

---

## Things to verify at implementation time

- Current `@module-federation/vite` version and Svelte 5 compatibility
- Vike + MF 2.0 integration: confirm Vike's renderer hooks don't conflict with MF runtime
- Whether `svelte-routing` (or alternative) plays nicely with SSR for the in-remote routing
