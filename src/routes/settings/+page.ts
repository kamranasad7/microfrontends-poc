// Federated remotes are CSR-only.
export const ssr = false;

// Unlike quizzes/students, this route does NOT preload via SK's load() function.
// settings's mf-manifest declares its own `remotes` (header — for the cross-
// framework auth Service consumption). When the host loads settings's
// remoteEntry, that nested-remote registration deadlocks specifically inside
// SK's hover-preload context — the App.tsx fetch never fires after the
// localSharedImportMap step. Click navigation eventually unsticks it (so the
// click path works), but preload times out and SK reports "Internal Error".
//
// Workaround lives in +layout.svelte: an onmouseenter / onfocus handler on
// the Settings link that fires the dynamic settings/App import directly,
// bypassing SK's load() pipeline. The browser caches the import; click then
// finds it already settled.
