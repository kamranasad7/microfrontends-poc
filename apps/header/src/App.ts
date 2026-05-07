import { mount, unmount } from 'svelte';
import Header from './Header.svelte';

export interface HeaderUser {
	name: string;
	avatarColor?: string;
}

export interface HeaderProps {
	appName: string;
	user: HeaderUser;
	accentColor?: string;
	notificationCount?: number;
	onLogout?: () => void;
}

export function render(target: HTMLElement, props: HeaderProps): () => void {
	const instance = mount(Header, { target, props });
	return () => {
		unmount(instance);
	};
}
