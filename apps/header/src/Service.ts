// Notifications service module exposed by the header MFE.
//
// Federation dedupes exposed modules: every host or remote that does
// `import('header/Service')` resolves to the SAME module instance. The state
// below is the single notification log shared across all MFEs. Any remote
// can push a notification via `addNotification(text)`; the header's bell
// badge picks it up reactively through `onNotificationsChange`.
//
// Pure TypeScript, no DOM, no framework — Svelte, React, and Vue consumers
// can all use it interchangeably.

export interface Notification {
	id: string;
	text: string;
	ts: number;
	read: boolean;
}

let notifications: Notification[] = [
	{ id: 'seed-1', text: 'Welcome back!', ts: Date.now() - 60_000, read: false },
	{ id: 'seed-2', text: '3 new quizzes graded', ts: Date.now() - 30_000, read: false },
	{ id: 'seed-3', text: 'New student enrolled in Algebra II', ts: Date.now() - 10_000, read: false }
];
const listeners = new Set<(n: Notification[]) => void>();

function emit() {
	for (const l of listeners) l(notifications);
}

function uid(): string {
	// crypto.randomUUID is available in modern browsers; falls back gracefully.
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
	return `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getNotifications(): Notification[] {
	return notifications;
}

export function getUnreadCount(): number {
	return notifications.reduce((n, x) => n + (x.read ? 0 : 1), 0);
}

export function addNotification(text: string): Notification {
	const n: Notification = { id: uid(), text, ts: Date.now(), read: false };
	notifications = [n, ...notifications].slice(0, 20);
	emit();
	return n;
}

export function dismissNotification(id: string): void {
	const next = notifications.filter((n) => n.id !== id);
	if (next.length === notifications.length) return;
	notifications = next;
	emit();
}

export function markAllRead(): void {
	if (notifications.every((n) => n.read)) return;
	notifications = notifications.map((n) => (n.read ? n : { ...n, read: true }));
	emit();
}

export function onNotificationsChange(cb: (n: Notification[]) => void): () => void {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
}
