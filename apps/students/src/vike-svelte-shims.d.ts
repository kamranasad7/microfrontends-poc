// Shim: vike-svelte 1.0.1 ships types under dist/ but its package.json `exports`
// field points to .js files without a `types` condition, so TS Bundler
// resolution can't pick up the .d.ts files. Re-declare the public surface here.
declare module 'vike-svelte/config' {
  const config: unknown;
  export default config;
}

declare module 'vike-svelte/context' {
  export const PageKey: 'vike-svelte:usePageContext';
  export const DataKey: 'vike-svelte:useData';
}
