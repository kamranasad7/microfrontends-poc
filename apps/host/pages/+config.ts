import vikeSvelte from 'vike-svelte/config';
import Layout from '../layouts/LayoutDefault.svelte';

export default {
  extends: vikeSvelte,
  title: 'JuiceMind Quizzes',
  Layout,
  // Host SSRs its own content (layout, sidebar, route content). Federated remotes
  // are loaded client-side only via the Federated wrapper (onMount → render(target,props)).
  // The wrapper renders an empty target div on server; the actual mount happens after
  // hydration. So host SSR is on, federated content is hybrid (CSR-mounted into SSR shell).
  ssr: true,
};
