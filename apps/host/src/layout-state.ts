import { writable } from 'svelte/store';
import type { Component } from 'svelte';

interface PageContextLite {
  urlPathname?: string;
  [key: string]: unknown;
}

// Svelte stores (work in SSR and CSR). onRenderClient writes on every nav,
// Layout/Sidebar subscribe reactively.
export const layoutPage = writable<Component<Record<string, unknown>> | null>(null);
export const layoutPageContext = writable<PageContextLite>({});
