import { getInstance } from '@module-federation/modern-js-v3/runtime';
import { lazyLoadComponentPlugin } from '@module-federation/modern-js-v3/react';

const instance = getInstance();
instance!.registerPlugins([lazyLoadComponentPlugin()]);

export { instance };
