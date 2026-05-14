import type { Quiz } from './schemas';

export const quizzes: Quiz[] = [
	{
		id: 'q-1',
		title: 'Algebra II — Polynomial Functions',
		subject: 'Mathematics',
		questionCount: 12,
		updatedAt: '2026-04-21T14:00:00Z'
	},
	{
		id: 'q-2',
		title: 'Cellular Respiration',
		subject: 'Biology',
		questionCount: 18,
		updatedAt: '2026-04-30T09:30:00Z'
	},
	{
		id: 'q-3',
		title: 'Industrial Revolution — Causes & Effects',
		subject: 'History',
		questionCount: 10,
		updatedAt: '2026-05-02T17:45:00Z'
	},
	{
		id: 'q-4',
		title: 'Newtonian Mechanics — Forces',
		subject: 'Physics',
		questionCount: 15,
		updatedAt: '2026-05-08T11:15:00Z'
	}
];

export function findById(id: string): Quiz | undefined {
	return quizzes.find((q) => q.id === id);
}
