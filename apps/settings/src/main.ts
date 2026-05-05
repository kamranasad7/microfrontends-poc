import { render } from './render';

const target = document.getElementById('root');
if (!target) throw new Error('#root not found');

render(target, {
  userName: 'Kamran (standalone)',
  userEmail: 'kamran@juicemind.app',
  onSave: (data) => {
    // eslint-disable-next-line no-alert
    alert(`Saved: ${JSON.stringify(data, null, 2)}`);
  },
});
