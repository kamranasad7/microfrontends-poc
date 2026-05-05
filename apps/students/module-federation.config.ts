import { createModuleFederationConfig } from '@module-federation/modern-js';

export default createModuleFederationConfig({
  name: 'students',
  manifest: {
    filePath: 'static',
  },
  filename: 'static/remoteEntry.js',
  exposes: {
    './Page': './src/Page.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  },
  dts: true,
});
