import { appTools, defineConfig } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/modern-js';

const PORT = 3002;

export default defineConfig({
  runtime: {
    router: true,
  },
  server: {
    port: PORT,
  },
  dev: {
    assetPrefix: `http://localhost:${PORT}`,
  },
  output: {
    assetPrefix: `http://localhost:${PORT}`,
  },
  plugins: [appTools({ bundler: 'rspack' }), moduleFederationPlugin()],
});
