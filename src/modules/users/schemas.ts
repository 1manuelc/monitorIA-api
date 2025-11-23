import { z } from 'zod';

const userSchema = z.object({
	id: z.number(),
	username: z.string(),
	email: z.string(),
	role: z.string(),
});

export const getUsersSchema = z.array(userSchema);

export const createUserSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	username: z.string(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createUserResponseSchema = z.object({
	id: z.string(),
	email: z.string(),
	username: z.string(),
});
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;

export const loginSchema = z.object({
	email: z.email({ message: 'Email é necessario' }),
	password: z.string().min(8),
});
export type LoginUserInput = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
	accessToken: z.string(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
