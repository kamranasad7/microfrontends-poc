interface RendererModule<P> {
  render: (target: HTMLElement, props: P) => () => void;
}

// Module-level cache shared across ALL Federated instances. After the first
// successful resolution, subsequent <Federated> mounts find the resolved module
// here and call render() synchronously — no Loading… flash on revisit.
// Browser's import() also caches, but returns a Promise; this cache stores the
// resolved value, letting us skip the async microtask entirely.
const cache = new WeakMap<() => unknown, RendererModule<Record<string, unknown>>>();

export function getCached(loader: () => unknown): RendererModule<Record<string, unknown>> | undefined {
  return cache.get(loader);
}

export function setCached(loader: () => unknown, mod: RendererModule<Record<string, unknown>>): void {
  cache.set(loader, mod);
}
