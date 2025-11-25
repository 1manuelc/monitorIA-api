import { answerSchema } from '../answers/schemas.js';
import z from 'zod';

export const getQuestionByIdSchema = z.object({
	questionId: z.string().transform((s) => Number(s)),
});

export type GetQuestionByIdInput = z.infer<typeof getQuestionByIdSchema>;

export const aiSuggestionResponseSchema = z.object({
	message: z.string(),
	answer: answerSchema,
});

export const aiSuggestionErrorSchema = z.object({
	message: z.string(),
});
