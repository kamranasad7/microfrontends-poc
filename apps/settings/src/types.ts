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
