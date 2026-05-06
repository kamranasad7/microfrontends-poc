import { createModuleFederationConfig } from '@module-federation/modern-js-v3';

export default createModuleFederationConfig({
  name: 'host',
  remotes: {
    quizzes: 'quizzes@http://localhost:3001/static/mf-manifest.json',
    students: 'students@http://localhost:3002/static/mf-manifest.json',
    header: 'header@http://localhost:3003/static/mf-manifest.json',
    settings: 'settings@http://localhost:3004/mf-manifest.json',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react/': { singleton: true },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom/': { singleton: true },
  },
  dts: true,
});
