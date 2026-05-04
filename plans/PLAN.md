# MFE Plan — Summary

## Stack
- **Module Federation 2.0** (`@module-federation/enhanced`) for runtime composition
- **Rspack** as bundler, **Modern.js** as the SSR framework on top
- **Host + React remote:** Modern.js + React 19 + React Router 7 (SSR'd)
- **Non-React remote:** Svelte 5 + Vite + `@module-federation/vite` (CSR when federated, SSR standalone)
- **pnpm workspaces + Turborepo + TypeScript** everywhere

## Architecture
```
host (:3000)          → shell, routes, embeds remote widgets
remote-react (:3001)  → exposes ./Routes (mounted at /shop) + ./CartWidget
remote-svelte (:3002) → exposes ./Page (mounted at /widgets) + ./Widget
```

Every remote ships **two exports**: a route-shaped one + a component-shaped one. That's how the "MFE is both route and component" constraint is satisfied.

## SSR scope (the compromise)
Host + React remote SSR via Modern.js. Svelte remote is client-rendered when embedded in the host (avoids cross-framework SSR-through-federation, which is bleeding edge).

## Key decisions
- Singleton-shared React/RR across React MFEs
- MF 2.0 `dts` for cross-remote types
- Runtime remote registration (URLs swappable per env)
- Error boundary around every remote mount

## Explicitly dropped
Next.js, SvelteKit, Webpack, Vite-as-host.

## Open
Where the monorepo lives on disk. No other blockers.
