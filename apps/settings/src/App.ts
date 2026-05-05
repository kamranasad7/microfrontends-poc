import { mount, unmount } from 'svelte';
import Settings from './Settings.svelte';

export interface SettingsData {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notifications: boolean;
}

export interface SettingsProps {
  userName: string;
  userEmail: string;
  onSave?: (data: SettingsData) => void;
}

export function render(target: HTMLElement, props: SettingsProps): () => void {
  const instance = mount(Settings, { target, props });
  return () => {
    unmount(instance);
  };
}
