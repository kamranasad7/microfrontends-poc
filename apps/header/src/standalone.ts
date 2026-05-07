import { render } from './App';

const target = document.getElementById('root');
if (!target) throw new Error('#root not found');

render(target, {
	appName: 'JuiceMind Quizzes',
	user: { name: 'Kamran', avatarColor: '#7c3aed' },
	accentColor: '#0f172a',
	notificationCount: 3,
	onLogout: () => alert('Standalone logout')
});
