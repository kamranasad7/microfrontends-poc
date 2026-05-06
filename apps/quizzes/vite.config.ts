import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import vike from 'vike/plugin';
import { federation } from '@module-federation/vite';

const PORT = 3001;

export default defineConfig({
  plugins: [
    vike(),
    svelte(),
    federation({
      name: 'quizzes',
      filename: 'remoteEntry.js',
      exposes: {
        './Page': './src/Page.svelte',
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
