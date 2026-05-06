import vikeSvelte from 'vike-svelte/config';
import Layout from '../layouts/LayoutDefault.svelte';
import type { Config } from 'vike/types';

export default {
  extends: vikeSvelte,
  title: 'JuiceMind Quizzes',
  Layout,
  // Federated imports via @module-federation/vite don't resolve cleanly at SSR time
  // (browser-only remote entries). Disabling SSR keeps Vike's file-based routing + code
  // splitting + dev DX, but federated content renders client-side. Same limitation as
  // the react-vite branch — Vite's federation plugin is CSR-friendly, SSR-rough.
  ssr: false,
} satisfies Config;
