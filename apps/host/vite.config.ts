import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

const PORT = 3000;

export default defineConfig({
  plugins: [
    react(),
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
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom/client': { singleton: true },
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
