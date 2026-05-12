// Federated remotes are CSR-only.
export const ssr = false;

// No load() — auth declares header as a nested remote (same as settings),
// which blocks SK hover-preload. Click still works.
