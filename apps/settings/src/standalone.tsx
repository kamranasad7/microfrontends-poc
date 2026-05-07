import { render } from './App';

const target = document.getElementById('root');
if (!target) throw new Error('#root not found');

render(target, {
	onSave: (data) => alert('Standalone save:\n' + JSON.stringify(data, null, 2)),
});
