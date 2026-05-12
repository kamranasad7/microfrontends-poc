import { createApp, type App as VueApp } from 'vue';
import LoginScreen from './LoginScreen.vue';

export interface AuthenticatedUser {
	name: string;
	email: string;
}

export interface AuthProps {
	onAuthenticated?: (user: AuthenticatedUser) => void;
}

export function render(target: HTMLElement, props: AuthProps = {}): () => void {
	// Vue's createApp expects `Data` (Record<string, unknown>) for rootProps —
	// interfaces aren't assignable due to TS's "interfaces are open" rule.
	// Narrow cast at this boundary keeps the public AuthProps precise.
	const app: VueApp = createApp(LoginScreen, props as Record<string, unknown>);
	app.mount(target);
	return () => {
		app.unmount();
	};
}
