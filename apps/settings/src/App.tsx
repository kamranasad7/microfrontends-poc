import { createRoot, type Root } from 'react-dom/client';
import { StrictMode } from 'react';
import Settings from './Settings';

export interface SettingsData {
	theme: 'light' | 'dark';
	language: 'en' | 'es' | 'fr';
	notifications: boolean;
}

export interface SettingsProps {
	onSave?: (data: SettingsData) => void;
}

export function render(target: HTMLElement, props: SettingsProps = {}): () => void {
	const root: Root = createRoot(target);
	root.render(
		<StrictMode>
			<Settings {...props} />
		</StrictMode>,
	);
	return () => {
		root.unmount();
	};
}
