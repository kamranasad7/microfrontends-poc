// Federated remotes are CSR-only.
export const ssr = false;

// KNOWN LIMITATION: no preload-of-federated-content for /settings.
//
// quizzes/students await the federated import here and SK's hover-preload
// completes the full federated graph before click. settings can't — its
// mf-manifest declares a nested remote (header — for the cross-framework
// auth Service consumption). The federation runtime can't reconcile that
// nested-remote handshake inside SK's hover-preload window; the App fetch
// never fires on hover. Click still works because the page lifecycle gives
// the handshake longer.
//
// Tried several workarounds (fire-and-forget here, manual hover handler in
// the layout, runtime init + loadRemote, prop drilling state from host).
// Each added more boilerplate than the limitation justified. Keep the route
// minimal — ssr=false only — and accept /settings clicks slightly slower on
// first visit.
