import { createRoot, type Root } from 'react-dom/client';
import { StrictMode } from 'react';
import Settings from './Settings';
import type { SettingsState } from './SettingsStore';

// SettingsData is the snapshot shape the host receives in the optional onSave
// callback. It mirrors the federated settings-store's state — kept as a named
// alias here so existing host code keeps compiling.
export type SettingsData = SettingsState;

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
