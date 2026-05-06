import type { Component } from 'svelte';

interface LayoutState {
  Page: Component | null;
  pageContext: { urlPathname?: string } & Record<string, unknown>;
}

// Single reactive object shared between onRenderClient and the Layout/Sidebar.
// onRenderClient mutates these on every client navigation;
// Svelte's reactivity keeps the Layout mounted and only re-renders affected children.
export const layoutState: LayoutState = $state({
  Page: null,
  pageContext: {},
});
