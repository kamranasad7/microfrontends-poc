// Stable loader functions for federated remotes. The bare specifier is
// rewritten by @module-federation/vite's proxyRemotes plugin (enforce: "pre",
// resolveId hook) into a virtual module path that bootstraps MF's runtime.
// Keeping these as named exports from a single shared module gives every
// caller the same function reference (useful for any cache that's keyed
// by the loader function).

export const loadSettings = () => import('settings/App');
