import z from 'zod';

export const getAnswersByQuestionIdSchema = z.object({
	questionId: z.string().transform((s) => Number(s)),
});
export type GetAnswersByQuestionIdInput = z.infer<
	typeof getAnswersByQuestionIdSchema
>;

export const getOneAnswerByQuestionIdSchema = z.object({
	questionId: z.string().transform((s) => Number(s)),
	answerId: z.string().transform((s) => Number(s)),
});
export type GetOneAnswerByQuestionIdInput = z.infer<
	typeof getOneAnswerByQuestionIdSchema
>;

export const createAnswerSchema = z.object({
	user_id: z.number(),
	body: z.string(),
});
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;

export const patchAnswerSchema = z.object({
	body: z.string().optional(),
	is_best_answer: z.boolean().optional(),
});
export type PatchAnswerInput = z.infer<typeof patchAnswerSchema>;

