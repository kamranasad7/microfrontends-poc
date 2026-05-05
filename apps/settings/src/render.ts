import { mount, unmount } from 'svelte';
import Settings from './Settings.svelte';
import type { SettingsProps } from './types';

export type { SettingsProps, SettingsData } from './types';

export function render(target: HTMLElement, props: SettingsProps): () => void {
  const instance = mount(Settings, { target, props });
  return () => {
    unmount(instance);
  };
}
