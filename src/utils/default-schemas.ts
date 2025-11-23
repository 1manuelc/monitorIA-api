import z from 'zod';

export const deleteMessageSchema = z.object({
	message: z.string(),
});

export const requestErrorMessageSchema = z.object({
	message: z.string(),
});
