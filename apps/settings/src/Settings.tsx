import { useEffect, useState } from 'react';
import * as Auth from 'auth/Service';
import type { AuthState } from 'auth/Service';
import * as Header from 'header/Service';
import type { SettingsData, SettingsProps } from './App';
import './Settings.css';

export default function Settings({ onSave }: SettingsProps) {
	// Federated imports — `Auth` and `Header` are the SAME module instances
	// used by every other MFE (federation runtime + browser ESM caching
	// dedupe to a single instance per module). Subscribing here reacts to
	// auth events fired from the Svelte header or Vue auth screen.
	const [authState, setAuthState] = useState<AuthState>(Auth.getAuthState());
	useEffect(() => Auth.onAuthChange(setAuthState), []);

	const [theme, setTheme] = useState<SettingsData['theme']>('light');
	const [language, setLanguage] = useState<SettingsData['language']>('en');
	const [notifications, setNotifications] = useState(true);

	const handleSave = () => {
		onSave?.({ theme, language, notifications });
		Header.addNotification(`Settings saved (${theme} / ${language})`);
	};

	return (
		<section className="settings">
			<header>
				<h1>Settings</h1>
				<p>This panel is rendered by the React <code>settings</code> MFE, federated into the SvelteKit host at runtime.</p>
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
							value={theme}
							onChange={(e) => setTheme(e.target.value as SettingsData['theme'])}
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
					</div>

					<div className="row">
						<label htmlFor="language">Language</label>
						<select
							id="language"
							value={language}
							onChange={(e) => setLanguage(e.target.value as SettingsData['language'])}
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
							checked={notifications}
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
