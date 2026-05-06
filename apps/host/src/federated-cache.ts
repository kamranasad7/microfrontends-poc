// The contract every federated remote exposes from `./App`, regardless of
// the framework it's built with. The host's Federated wrapper only ever
// touches `render`; the rest is the remote's business.
export interface RendererModule<P = Record<string, unknown>> {
  render: (target: HTMLElement, props: P) => () => void;
}

// Module-level cache shared across all Federated instances. Browser's import()
// also caches, but returns a Promise; this stores the resolved module so a
// revisit can call render() synchronously and avoid the fallback flash.
const cache = new WeakMap<() => unknown, RendererModule>();

export function getCached(loader: () => unknown): RendererModule | undefined {
  return cache.get(loader);
}

export function setCached(loader: () => unknown, mod: RendererModule): void {
  cache.set(loader, mod);
}
