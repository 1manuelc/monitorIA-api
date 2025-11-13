import { z } from 'zod';

export const createUserSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
	name: z.string(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createUserResponseSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
});
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;

export const loginSchema = z.object({
	email: z.email({ message: 'Email is required' }),
	password: z.string().min(6),
});
export type LoginUserInput = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
	accessToken: z.string(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
