import { z } from 'zod';

export const StudentSchema = z.object({
	id: z.string(),
	name: z.string(),
	grade: z.string(),
	enrolledAt: z.string()
});

export type Student = z.infer<typeof StudentSchema>;

export const ListOutput = z.array(StudentSchema);
