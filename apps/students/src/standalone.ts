import { render } from './App';

const target = document.getElementById('root');
if (!target) throw new Error('#root not found');

render(target, { subtitle: 'Standalone preview of the students remote.' });
