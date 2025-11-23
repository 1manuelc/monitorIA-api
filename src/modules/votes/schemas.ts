import z from 'zod';

export const getVotesByTargetSchema = z.object({
	target_id: z.string().transform((s) => Number(s)),
	target_type: z.string(),
	get_value: z
		.string()
		.transform((s) => s === 'true')
		.optional(),
});
export type GetVotesByTargetInput = z.infer<typeof getVotesByTargetSchema>;

export const getVotesByTargetResponse = z.union([
	z.object({
		id: z.number(),
		target_id: z.number(),
		target_type: z.string(),
		user_id: z.number(),
		vote_type: z.number(),
		created_at: z.date(),
	}),
	z.object({
		value: z.number(),
	}),
]);

export const createVoteSchema = z.object({
	user_id: z.number(),
	target_id: z.number(),
	target_type: z.string(),
	vote_type: z.union([z.literal(1), z.literal(-1)]),
});
export type CreateVoteInput = z.infer<typeof createVoteSchema>;

export const createVoteResponseSchema = z.object({
	id: z.number(),
	target_id: z.number(),
	target_type: z.string(),
	user_id: z.number(),
	vote_type: z.number(),
	created_at: z.date(),
});

export const patchVoteBodySchema = z.object({
	vote_type: z.union([z.literal(1), z.literal(-1)]),
});
export type PatchVoteInput = z.infer<typeof patchVoteBodySchema>;

export const patchVoteParamsSchema = z.object({
	id: z.string().transform((s) => Number(s)),
});
export type PatchVoteParams = z.infer<typeof patchVoteParamsSchema>;
