import { mount, unmount } from 'svelte';
import Page from './Page.svelte';

export interface StudentsProps {
	subtitle?: string;
}

export function render(target: HTMLElement, props: StudentsProps = {}): () => void {
	const instance = mount(Page, { target, props });
	return () => {
		unmount(instance);
	};
}
