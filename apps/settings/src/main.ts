import { mount } from 'svelte';
import Settings from './Settings.svelte';

const target = document.getElementById('root');
if (!target) throw new Error('#root not found');

mount(Settings, {
  target,
  props: {
    userName: 'Kamran (standalone)',
    userEmail: 'kamran@juicemind.app',
    onSave: (data) => {
      // eslint-disable-next-line no-alert
      alert(`Saved: ${JSON.stringify(data, null, 2)}`);
    },
  },
});
