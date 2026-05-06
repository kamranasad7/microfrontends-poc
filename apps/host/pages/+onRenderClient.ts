import { hydrate, mount } from 'svelte';
import { PageKey } from 'vike-svelte/context';
import LayoutDefault from '../layouts/LayoutDefault.svelte';
import { layoutPage, layoutPageContext } from '../src/layout-state';
import type { PageContextClient } from 'vike/types';

// Override vike-svelte's onRenderClient (which unmounts + remounts Layout
// on every navigation). We mount Layout once on hydration, then update the
// reactive stores on every subsequent navigation. Layout/Sidebar subscribe
// to the stores; Header MFE inside Layout stays mounted across nav.

let mounted = false;

export function onRenderClient(pageContext: PageContextClient): void {
  layoutPage.set((pageContext.Page ?? null) as Parameters<typeof layoutPage.set>[0]);
  layoutPageContext.set(pageContext as unknown as Parameters<typeof layoutPageContext.set>[0]);

  if (mounted) return;

  const target = document.getElementById('root');
  if (!target) throw new Error('#root not found');

  const options = {
    target,
    context: new Map<unknown, unknown>([[PageKey, pageContext]]),
    props: {},
  };

  if (pageContext.isHydration) {
    hydrate(LayoutDefault, options);
  } else {
    mount(LayoutDefault, options);
  }
  mounted = true;
}
