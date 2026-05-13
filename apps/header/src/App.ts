import { mount, unmount } from 'svelte';
import Header from './Header.svelte';

export interface HeaderProps {
	appName: string;
	accentColor?: string;
}

export function render(target: HTMLElement, props: HeaderProps): () => void {
	const instance = mount(Header, { target, props });
	return () => {
		unmount(instance);
	};
}
