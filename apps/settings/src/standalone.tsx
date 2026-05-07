import { render } from './App';

const target = document.getElementById('root');
if (!target) throw new Error('#root not found');

render(target, {
	userName: 'Kamran',
	userEmail: 'kamran@juicemind.app',
	onSave: (data) => alert('Standalone save:\n' + JSON.stringify(data, null, 2)),
});
