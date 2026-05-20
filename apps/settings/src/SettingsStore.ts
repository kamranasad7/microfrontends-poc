// settings-store: federated state module for theme + language + the
// notifications-enabled flag. Exposed by the settings MFE as
// `settings/SettingsStore`.
//
// Built on Nanostores — a 294-byte atomic store with first-class adapters
// for React (@nanostores/react), Vue (@nanostores/vue), and native Svelte
// support (atoms implement Svelte's store contract, so `$settings` in a
// Svelte component auto-subscribes). Federation dedupes the module to a
// single instance per page, so every MFE reads the same atom.
//
// Theme reactivity flows two ways:
//   1. JS subscribers (React panel, Svelte header) react through the atom.
//   2. The store's own `subscribe` writes `<html data-theme="dark|light">`
//      on every change, so MFE CSS using `var(--bg-card)` etc. flips even
//      in MFEs that never imported the store.

import { persistentAtom } from '@nanostores/persistent';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es' | 'fr';

export interface SettingsState {
	theme: Theme;
	language: Language;
	notifications: boolean;
}

const DEFAULT_STATE: SettingsState = {
	theme: 'light',
	language: 'en',
	notifications: true
};

// One atom for the whole settings object. `persistentAtom` syncs to
// localStorage under the given key, encoding/decoding via JSON.
export const settings = persistentAtom<SettingsState>('settings.v1', DEFAULT_STATE, {
	encode: JSON.stringify,
	decode: JSON.parse
});

// Side-effect: stamp the theme onto <html data-theme> whenever it changes.
// The subscribe call fires immediately with the current value, so the right
// theme is applied as soon as the module is imported.
if (typeof window !== 'undefined') {
	settings.subscribe((s) => {
		document.documentElement.dataset.theme = s.theme;
	});
}

// Setters. Each is a no-op if nothing changed (atom won't notify in that
// case anyway, but keeping the guard documents intent and avoids the spread).
export function setTheme(theme: Theme): void {
	if (settings.get().theme === theme) return;
	settings.set({ ...settings.get(), theme });
}

export function setLanguage(language: Language): void {
	if (settings.get().language === language) return;
	settings.set({ ...settings.get(), language });
}

export function setNotifications(enabled: boolean): void {
	if (settings.get().notifications === enabled) return;
	settings.set({ ...settings.get(), notifications: enabled });
}

// Display helpers — keep UI shape concerns in the store so every consumer
// renders the same labels.
export const LANGUAGE_LABELS: Record<Language, string> = {
	en: 'English',
	es: 'Español',
	fr: 'Français'
};
