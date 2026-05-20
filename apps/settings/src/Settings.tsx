import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import * as Auth from 'auth/Service';
import type { AuthState } from 'auth/Service';
import * as Header from 'header/Service';
import { settings, setTheme, setLanguage, setNotifications } from './SettingsStore';
import type { SettingsState } from './SettingsStore';
import type { SettingsProps } from './App';
import './Settings.css';

export default function Settings({ onSave }: SettingsProps) {
	// auth-store + notifications-store still use the hand-rolled pub/sub
	// pattern; settings-store is on Nanostores. `useStore` from
	// @nanostores/react subscribes via React's useSyncExternalStore and
	// re-renders this component whenever the atom changes — no manual
	// useState/useEffect needed.
	const [authState, setAuthState] = useState<AuthState>(Auth.getAuthState());
	useEffect(() => Auth.onAuthChange(setAuthState), []);

	const s = useStore(settings);

	const handleSave = () => {
		onSave?.(s);
		Header.addNotification(`Settings saved (${s.theme} / ${s.language})`);
	};

	return (
		<section className="settings">
			<header>
				<h1>Settings</h1>
				<p>
					Rendered by the React <code>settings</code> MFE. Each control writes to
					<code>settings/SettingsStore</code> — the federated store the Svelte header
					reads for the language badge and every MFE's CSS reads (via the
					<code>data-theme</code> root attribute) for dark mode.
				</p>
			</header>

			{authState.isAuthenticated && authState.user ? (
				<>
					<div className="account">
						<div
							className="avatar"
							style={{
								background: `linear-gradient(135deg, ${authState.user.avatarColor ?? '#a78bfa'}, #4c1d95)`,
							}}
						>
							{authState.user.name.charAt(0).toUpperCase()}
						</div>
						<div>
							<div className="name">{authState.user.name}</div>
							<div className="email">{authState.user.email}</div>
						</div>
					</div>

					<div className="row">
						<label htmlFor="theme">Theme</label>
						<select
							id="theme"
							value={s.theme}
							onChange={(e) => setTheme(e.target.value as SettingsState['theme'])}
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
					</div>

					<div className="row">
						<label htmlFor="language">Language</label>
						<select
							id="language"
							value={s.language}
							onChange={(e) => setLanguage(e.target.value as SettingsState['language'])}
						>
							<option value="en">English</option>
							<option value="es">Español</option>
							<option value="fr">Français</option>
						</select>
					</div>

					<div className="row">
						<label htmlFor="notif">Notifications</label>
						<input
							id="notif"
							type="checkbox"
							checked={s.notifications}
							onChange={(e) => setNotifications(e.target.checked)}
						/>
					</div>

					<div className="actions">
						<button type="button" onClick={handleSave}>Save</button>
						<button type="button" className="secondary" onClick={() => Auth.logout()}>
							Sign out
						</button>
					</div>
				</>
			) : (
				<div className="signed-out">
					<p>You're signed out. Use the <strong>Sign in</strong> button in the header to come back.</p>
				</div>
			)}
		</section>
	);
}
