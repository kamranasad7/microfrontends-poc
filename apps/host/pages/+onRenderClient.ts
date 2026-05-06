import { hydrate, mount } from 'svelte';
import { PageKey } from 'vike-svelte/context';
import LayoutDefault from '../layouts/LayoutDefault.svelte';
import { layoutState } from '../src/layout-state.svelte';
import type { PageContextClient } from 'vike/types';

// Override vike-svelte's onRenderClient (which unmounts + remounts the entire
// Layout on every navigation, causing the federated Header MFE to flicker /
// re-mount on every route change).
// Instead, mount the Layout ONCE on first hydration, then update the reactive
// `layoutState` on each subsequent navigation. Svelte's reactivity swaps the
// Page slot inside the persistent Layout — Header MFE stays mounted.

let mounted = false;

export function onRenderClient(pageContext: PageContextClient): void {
  // Update reactive state first — works for both initial and subsequent renders
  layoutState.Page = (pageContext.Page ?? null) as typeof layoutState.Page;
  layoutState.pageContext = pageContext as typeof layoutState.pageContext;

  if (mounted) return;

  const target = document.getElementById('root');
  if (!target) throw new Error('#root not found');

  const options = {
    target,
    context: new Map<unknown, unknown>([[PageKey, pageContext]]),
    props: layoutState,
  };

  if (pageContext.isHydration) {
    hydrate(LayoutDefault, options);
  } else {
    mount(LayoutDefault, options);
  }
  mounted = true;
}
