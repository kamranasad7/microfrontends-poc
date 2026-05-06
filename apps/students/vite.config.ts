import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vike from 'vike/plugin';
import { federation } from '@module-federation/vite';

const PORT = 3002;

export default defineConfig({
  plugins: [
    vike(),
    svelte(),
    federation({
      name: 'students',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.ts',
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
