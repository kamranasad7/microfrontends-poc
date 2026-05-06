import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vike from 'vike/plugin';
import { federation } from '@module-federation/vite';

const PORT = 3000;

export default defineConfig({
  plugins: [
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
      },
      shared: {
        svelte: { singleton: true, requiredVersion: '^5.0.0' },
        'svelte/': { singleton: true },
      },
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
