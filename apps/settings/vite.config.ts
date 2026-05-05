import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';

const PORT = 3004;

export default defineConfig({
  plugins: [
    svelte(),
    federation({
      name: 'settings',
      filename: 'remoteEntry.js',
      exposes: {
        './Settings': './src/render.ts',
      },
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
  preview: {
    port: PORT,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    cssCodeSplit: false,
  },
});
