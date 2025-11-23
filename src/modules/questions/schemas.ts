import z from 'zod';

export const questionSchema = z.object({
	id: z.number(),
	user_id: z.number(),
	topic_id: z.number(),
	title: z.string(),
	body: z.string(),
	created_at: z.date(),
	updated_at: z.date(),
	is_resolved: z.boolean(),
});

export const getAllQuestionsResponseSchema = z.array(questionSchema);

export const createQuestionSchema = z.object({
	user_id: z.number(),
	topic_id: z.number(),
	title: z.string(),
	body: z.string(),
});
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const createQuestionResponseSchema = z.object({
	id: z.number(),
	title: z.string(),
	body: z.string(),
	user_id: z.number(),
	topic_id: z.number(),
	created_at: z.date(),
});
export type CreateQuestionResponse = z.infer<
	typeof createQuestionResponseSchema
>;

export const getQuestionByIdSchema = z.object({
	id: z.string().transform((s) => Number(s)),
});
export type GetQuestionByIdInput = z.infer<typeof getQuestionByIdSchema>;

export const patchQuestionSchema = z.object({
	topic_id: z.number().optional(),
	title: z.string().optional(),
	body: z.string().optional(),
	is_resolved: z.boolean().optional(),
});
export type PatchQuestionInput = z.infer<typeof patchQuestionSchema>;
