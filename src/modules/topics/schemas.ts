import z from 'zod';

export const getTopicByIdSchema = z.object({
	id: z.string().transform((s) => Number(s)),
});
export type GetTopicByIdInput = z.infer<typeof getTopicByIdSchema>;

export const createTopicSchema = z.object({
	name: z.string(),
	parent_id: z.int().optional(),
	description: z.string().optional(),
});
export type CreateTopicInput = z.infer<typeof createTopicSchema>;

export const createTopicResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	parent_id: z.int().nullable().optional(),
	description: z.string().nullable().optional(),
});
export type CreateTopicResponse = z.infer<typeof createTopicResponseSchema>;

export const editTopicSchema = z.object({
	name: z.string().optional(),
	parent_id: z.int().optional(),
	description: z.string().optional(),
});
export type EditTopicInput = z.infer<typeof editTopicSchema>;

export const editTopicResponseSchema = z.object({
	id: z.number(),
	name: z.string().nullable().optional(),
	parent_id: z.int().nullable().optional(),
	description: z.string().nullable().optional(),
});
export type EditTopicResponse = z.infer<typeof editTopicResponseSchema>;

export const deleteTopicResponseSchema = z.object({
	message: z.string(),
});
export type DeleteTopicResponse = z.infer<typeof deleteTopicResponseSchema>;
