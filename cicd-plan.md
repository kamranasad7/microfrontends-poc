# CI/CD Plan — Module Federation 2.0 + Vite

How types flow, how each app builds and deploys, where races hide, and which defenses to wire up.

---

## 1. How type sharing works in this stack

Each app's `vite.config.ts` has `dts: true`. That hooks `@module-federation/dts-plugin` into the build, with different behavior on the two sides:

### Remote side (`quizzes`, `students`, `header`)
1. Runs `tsc` over the files listed in `exposes`
2. Emits `.d.ts` to `dist/@mf-types/`
3. Bundles them into `@mf-types.zip`
4. Updates the emitted `mf-manifest.json` so its `metaData.types` field points at the archive

A deployed remote serves **two artifacts at the same URL**:
- `remoteEntry.js` — the runtime JS the browser executes
- `@mf-types.zip` — the compile-time types TypeScript reads

### Host side
At dev/build time the host plugin:
1. Reads each remote's `mf-manifest.json` from the URL configured in `vite.config.ts`
2. Downloads the corresponding `@mf-types.zip`
3. Unzips into `apps/host/@mf-types/<remote-name>/`
4. The host's `tsconfig.json` `paths: { "*": ["./@mf-types/*"] }` makes TS resolve `import('quizzes/Page')` to `apps/host/@mf-types/quizzes/Page.d.ts`

End result: federated imports in [App.tsx](apps/host/src/App.tsx) are fully typed, not `any`.

> **Critical timing detail:** types are pulled at host **build time**. Remote JS is pulled at user **runtime**. Those two events can be hours, days, or months apart. That gap is where drift lives.

---

## 2. Per-app build & deploy pipelines

Each MFE has its own pipeline, its own URL, its own version. No cross-repo coordination required to ship a remote.

### Remote pipeline (e.g. `quizzes`)
```
PR merged in quizzes repo
  → CI:  pnpm build
           emits dist/remoteEntry.js
           emits dist/mf-manifest.json
           emits dist/@mf-types.zip
  → CD:  upload dist/ to https://quizzes.juicemind.app/v{N}/
         update https://quizzes.juicemind.app/latest/ → v{N}
         (or skip /latest/ if pinning — see §4 mitigation 2)
```

### Host pipeline
```
PR merged in host repo
  → CI:  pnpm build
           reads each remote's mf-manifest.json from public URL
           downloads @mf-types.zip from each
           typechecks against current types
           bundles host JS (no remote code — remotes load at runtime)
  → CD:  upload host dist/ to https://app.juicemind.app/
```

### Browser runtime
```
User loads host
  → host JS executes
  → React hits a federated import: import('quizzes/Page')
  → MF runtime fetches https://quizzes.juicemind.app/{version}/remoteEntry.js
  → executes it, returns the component
  → React renders the federated component
```

---

## 3. The race conditions

### Race A — coordinated release with `latest/` URLs

If both the host PR and a remote PR merge together and CI/CDs run in parallel:

```
T+00s  quizzes pipeline:  build ████ → upload ███ → CDN invalidate ██ → live
T+00s  host pipeline:     build ███████████████ → upload ███ → live

       ↑ at ~T+05s host's build runs the dts plugin which fetches
         /mf-manifest.json from the LIVE quizzes URL — which still
         serves the OLD artifact because quizzes' upload hasn't
         finished yet
```

What happens depends on what changed:

| Change in quizzes | Host build outcome | Runtime outcome |
|---|---|---|
| Added optional prop, host doesn't use it | Compiles against old types | Fine — drift but no break |
| Added required prop, host updated to pass it | **Type error** — old types don't know the prop, CI fails, retry succeeds later | Self-heals via failed build |
| Renamed/removed prop, host updated to match | **Type error** — same as above | Self-heals |
| Quizzes added required prop, host NOT updated | Compiles fine against old types | **Production crash** — old host JS deploys, runtime loads quizzes' new JS expecting the new prop |

Row 4 is the silent killer: typecheck passes against stale types, both pipelines succeed, and runtime mismatch hits real users.

### Race B — CDN edge propagation

Even after a remote's upload completes, edge caches around the world serve the old artifact for tens of seconds. If host's build runner happens to hit a cold edge, it gets stale types even though the origin is fresh.

### Race C — solo remote deploy with `latest/` URLs

A remote ships a backwards-incompatible change without coordinating with the host. `latest/` flips, host wasn't rebuilt. Browser runtime sees mismatch immediately. Same as Race A row 4 but without any CI coordination to even attempt to catch it.

---

## 4. Mitigations, ordered by leverage

### Mitigation 1 — Topological deploy ordering
Make host's CD `needs:` all remotes' CDs.

```yaml
# release orchestrator (mono-repo or cross-repo via repository_dispatch)
jobs:
  deploy-quizzes:    steps: [...]
  deploy-students:   steps: [...]
  deploy-header:     steps: [...]

  deploy-host:
    needs: [deploy-quizzes, deploy-students, deploy-header]
    steps:
      - wait for CDN propagation
      - pnpm build           # now safely fetches fresh types
      - upload
```

Across separate repos: remote CDs fire `repository_dispatch` events that the host repo listens for, so host pipeline runs *after* remotes are confirmed live.

Kills Race A for coordinated releases. Doesn't help with Race C (solo remote deploy).

### Mitigation 2 — Pinned versions (the strongest defense)

Stop pointing host at `latest/`. Pin to a specific build URL:

```ts
remotes: {
  quizzes: { entry: 'https://quizzes.juicemind.app/v43/mf-manifest.json', ... }
}
```

Now upgrading quizzes becomes a deliberate host PR:
1. Quizzes deploys v43 to `/v43/` (does NOT move `/latest/`)
2. Someone opens host PR bumping the URL to `/v43/`
3. Host CI downloads v43 types, typechecks → success or fails fast
4. Host deploys, runtime loads v43 JS — same version as types

No race possible because once `/v43/` is live it never changes.

**Trade-off:** gives back some of "ship independently without coordinating." For breaking changes that's fine. For non-breaking changes you're forcing a host rebuild. Middle ground: pin to a major (`/v43-major/`), let minors flow.

### Mitigation 3 — Wait-for-propagation poll in host CI

If you want `/latest/` URLs but want to defuse Race B, have host CI poll until manifests show the expected version:

```bash
# host CI step before pnpm build
for remote in quizzes students header; do
  expected_version=$EXPECTED_VERSION   # passed in by orchestrator
  until [ "$(curl -s https://$remote.juicemind.app/latest/mf-manifest.json \
              | jq -r .metaData.buildInfo.buildVersion)" = "$expected_version" ]; do
    sleep 5
    # bail after 3 minutes
  done
done
pnpm build
```

Catches CDN propagation lag, not just "did the upload finish".

### Mitigation 4 — Atomic promotion (Vercel/Netlify pattern)

Both host and remotes build to `staging-{sha}` URLs. A separate "promote" step at the end of all pipelines flips DNS/aliases to point at the new builds simultaneously. Engineering the flip order: remotes first, wait, host.

This is what Vercel/Netlify do with deployment aliases. Cleanest production answer if your platform supports it.

### Mitigation 5 — `abortOnError` on dts consume

In every app's `vite.config.ts`:

```ts
dts: {
  consumeTypes: {
    abortOnError: true,   // fail the build instead of using stale types
    maxRetries: 5,
  },
}
```

Host CI hard-fails if it can't get fresh types — a "host deployed faster than remote" race surfaces as a CI failure instead of a silent stale-type build. Free defense, no infrastructure.

### Mitigation 6 — CI gate: downstream typecheck

Every remote PR runs a downstream typecheck against the host:

```yaml
# .github/workflows/quizzes-pr.yml (in the quizzes repo)
on: pull_request
jobs:
  downstream-host-typecheck:
    steps:
      - checkout quizzes
      - build quizzes preview deploy → temp URL
      - checkout host
      - override host's quizzes URL → temp URL
      - pnpm install && pnpm typecheck in host
      - fail PR if host breaks
```

Catches Race A row 4 **before it ships**: if the quizzes PR introduces a breaking change the host doesn't know about, the host typecheck fails, the quizzes PR is blocked. Consumer-driven contract pattern.

For multiple host consumers, run this for each. For many consumers, this becomes a contract-test setup (#7 below).

### Mitigation 7 — Runtime version assertion

Last line of defense. Bake an `expectedVersions` map into the host build, check at boot:

```ts
// apps/host/src/checkRemotes.ts
const expected = { quizzes: '43.x', students: '17.x', header: '8.x' };

export async function assertRemoteVersions() {
  for (const [name, range] of Object.entries(expected)) {
    const manifest = await fetch(`${REMOTE_URLS[name]}/mf-manifest.json`).then(r => r.json());
    const actual = manifest.metaData.buildInfo.buildVersion;
    if (!semver.satisfies(actual, range)) {
      Sentry.captureMessage(`MFE drift: ${name} expected ${range}, got ${actual}`);
      // optionally render fallback shell instead of mounting the broken remote
    }
  }
}
```

Catches drift in production even when CI gates didn't fire. Especially useful for stale clients (long-running tabs, cached PWAs).

### Mitigation 8 — MF 2.0 manifest registry (the "future" answer)

MF 2.0 supports publishing manifests to a central registry. The host queries the registry **at runtime** (not at build time) for the latest compatible version. This moves remote discovery out of build time entirely — host doesn't bake remote URLs into its bundle, it discovers them at boot.

Bigger setup lift (run a registry service, or use Zephyr Cloud / similar SaaS). Kills this entire class of races.

---

## 5. Recommended setup for JuiceMind Quizzes

Layered defense. Each layer catches what the others miss.

| # | Layer | Solves | Effort |
|---|---|---|---|
| 1 | Topological CI ordering + propagation wait (M1 + M3) | Race A & B for coordinated releases | Medium — orchestrator workflow |
| 2 | Pinned major versions in host (M2) | Race A row 4 + Race C | Low — config change |
| 3 | `abortOnError: true` on dts consume (M5) | Stale-type silent builds | 4 lines in each `vite.config.ts` |
| 4 | Strict shared deps (`strictVersion: true`) | React/RR version drift | 4 lines in shared config |
| 5 | Downstream typecheck gate per remote PR (M6) | Breaking changes shipped uncoordinated | Medium — GitHub Actions across repos |
| 6 | Runtime version check (M7) | Stale CDN edges, stale clients in prod | ~30 lines + Sentry hookup |
| 7 | (Defer) Manifest registry (M8) | Build-time/runtime discovery split | High — infra or SaaS spend |

**The minimum viable defense** if you can only do three things:
1. `abortOnError: true` on dts (M5) — free
2. `strictVersion: true` on shared React (M4) — free
3. Pinned major versions in host (M2) — config-only

That kills the silent-failure modes. Add M1 + M6 + M7 once you have multiple environments and real users.

---

## 6. Current POC status vs prod-ready

| Concern | POC today | Gap |
|---|---|---|
| `dts` auto-sync | ✅ working in dev | ✅ also works for prod build, just need URL pointing at deployed manifest |
| Singleton shared React | ✅ configured | Add `strictVersion: true` |
| Pinned remote versions | ❌ all point at `localhost` | Replace with versioned CDN URLs |
| `abortOnError` on dts consume | ❌ not set | 4 lines per `vite.config.ts` |
| CI ordering | ❌ no CI yet | Set up GitHub Actions |
| Downstream typecheck gate | ❌ | Cross-repo dispatch |
| Runtime version check | ❌ | Small new file in host + Sentry |
| Atomic promotion | ❌ | Pick a host (Vercel/Netlify/own) and use their alias mechanism |
