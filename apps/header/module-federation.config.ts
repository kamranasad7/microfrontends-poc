import { createModuleFederationConfig } from '@module-federation/modern-js';

export default createModuleFederationConfig({
  name: 'header',
  manifest: {
    filePath: 'static',
  },
  filename: 'static/remoteEntry.js',
  exposes: {
    './Header': './src/Header.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  },
  dts: true,
});
