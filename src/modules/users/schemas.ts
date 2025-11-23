import { z } from 'zod';

export const userSchema = z.object({
	id: z.number(),
	username: z.string(),
	email: z.string(),
	role: z.string(),
});

export const getUsersSchema = z.array(userSchema);

export const getOneUserSchema = z.object({
	id: z.string().transform((s) => Number(s)),
});
export type GetOneUserInput = z.infer<typeof getOneUserSchema>;

export const patchUserSchema = z.object({
	username: z.string().optional(),
	email: z.string().optional(),
	role: z.string().optional(),
});
export type PatchUserInput = z.infer<typeof patchUserSchema>;
