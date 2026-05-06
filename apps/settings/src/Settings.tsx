import { useState } from 'react';
import type { SettingsData, SettingsProps } from './App';
import './Settings.css';

export default function Settings({
  userName = 'Guest',
  userEmail = 'guest@example.com',
  onSave,
}: SettingsProps) {
  const [theme, setTheme] = useState<SettingsData['theme']>('light');
  const [language, setLanguage] = useState<SettingsData['language']>('en');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    onSave?.({ theme, language, notifications });
  };

  return (
    <section className="settings">
      <header>
        <h1>Settings</h1>
        <p>This panel is rendered by the React <code>settings</code> MFE, federated into the Svelte host at runtime.</p>
      </header>

      <div className="account">
        <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
        <div>
          <div className="name">{userName}</div>
          <div className="email">{userEmail}</div>
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

      <button type="button" onClick={handleSave}>Save</button>
    </section>
  );
}
