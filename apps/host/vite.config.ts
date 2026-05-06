import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vike from 'vike/plugin';
import { federation } from '@module-federation/vite';
import { extractSvelteCss } from './vite-plugin-extract-svelte-css';

const PORT = 3000;

export default defineConfig({
  plugins: [
    extractSvelteCss(),
    vike(),
    svelte(),
    federation({
      name: 'host',
      remotes: {
        quizzes: {
          type: 'module',
          name: 'quizzes',
          entry: 'http://localhost:3001/mf-manifest.json',
        },
        students: {
          type: 'module',
          name: 'students',
          entry: 'http://localhost:3002/mf-manifest.json',
        },
        header: {
          type: 'module',
          name: 'header',
          entry: 'http://localhost:3003/mf-manifest.json',
        },
        settings: {
          type: 'module',
          name: 'settings',
          entry: 'http://localhost:3004/mf-manifest.json',
        },
      },
      // No svelte sharing across federation: host uses the render-function
      // pattern and each remote bundles its own runtime. Sharing breaks the
      // host's SSR — MF substitutes a browser-only svelte build that lacks
      // server-side onMount/etc.
      shared: {},
      manifest: true,
      dts: true,
    }),
  ],
  server: {
    port: PORT,
    strictPort: true,
    cors: true,
    origin: `http://localhost:${PORT}`,
  },
  preview: { port: PORT, strictPort: true },
});
