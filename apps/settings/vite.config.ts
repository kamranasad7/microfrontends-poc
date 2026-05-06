import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

const PORT = 3004;

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'settings',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      // No react sharing across federation: host uses the render-function
      // pattern and each remote bundles its own runtime (see host/vite.config
      // for the SSR-hijack reasoning that motivated this for svelte too).
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
  build: {
    target: 'esnext',
    modulePreload: false,
    cssCodeSplit: false,
  },
});
