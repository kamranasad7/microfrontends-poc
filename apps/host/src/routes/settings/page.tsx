import type { SettingsData } from 'settings/App';
import SvelteIsland from '../../SvelteIsland';

const loadSettings = () => import('settings/App');

export default function SettingsRoute() {
  return (
    <SvelteIsland
      load={loadSettings}
      props={{
        userName: 'Kamran',
        userEmail: 'kamran@juicemind.app',
        onSave: (data: SettingsData) => {
          alert(`Host received settings save:\n${JSON.stringify(data, null, 2)}`);
        },
      }}
    />
  );
}
