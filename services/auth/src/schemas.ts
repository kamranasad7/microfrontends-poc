import { z } from 'zod';

export const UserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	avatarColor: z.string().optional()
});

export type User = z.infer<typeof UserSchema>;

export const LoginInput = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});

export const LoginOutput = z.object({
	user: UserSchema,
	token: z.string()
});

export const MeOutput = z.object({
	user: UserSchema
});

export const OkOutput = z.object({
	ok: z.literal(true)
});
