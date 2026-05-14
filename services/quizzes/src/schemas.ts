import { z } from 'zod';

export const QuizSchema = z.object({
	id: z.string(),
	title: z.string(),
	subject: z.string(),
	questionCount: z.number().int().positive(),
	updatedAt: z.string()
});

export type Quiz = z.infer<typeof QuizSchema>;

export const GetInput = z.object({
	id: z.string()
});

export const ListOutput = z.array(QuizSchema);
