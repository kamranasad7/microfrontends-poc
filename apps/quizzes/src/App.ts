import { mount, unmount } from 'svelte';
import Page from './Page.svelte';

export interface QuizzesProps {
	greeting?: string;
}

export function render(target: HTMLElement, props: QuizzesProps = {}): () => void {
	const instance = mount(Page, { target, props });
	return () => {
		unmount(instance);
	};
}
