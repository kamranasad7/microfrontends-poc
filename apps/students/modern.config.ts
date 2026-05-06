import { appTools, defineConfig } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/modern-js-v3';

const PORT = 3002;

export default defineConfig({
  server: {
    port: PORT,
    ssr: { mode: "stream" },
  },
  dev: {
    assetPrefix: `http://localhost:${PORT}`,
  },
  output: {
    assetPrefix: `http://localhost:${PORT}`,
  },
  plugins: [appTools(), moduleFederationPlugin()],
});
