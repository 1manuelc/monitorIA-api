import { FastifyInstance } from 'fastify';
import {
	createVoteSchema,
	getVotesByTargetSchema,
	patchVoteBodySchema,
	patchVoteParamsSchema,
} from './schemas.js';
import {
	createVote,
	deleteVote,
	getAllVotes,
	patchVote,
} from './controller.js';

export async function voteRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{ schema: { querystring: getVotesByTargetSchema } },
		getAllVotes,
	);

	app.post('/', { schema: { body: createVoteSchema } }, createVote);

	app.patch(
		'/:id',
		{
			schema: {
				body: patchVoteBodySchema,
				params: patchVoteParamsSchema,
			},
		},
		patchVote,
	);

	app.delete(
		'/:id',
		{ schema: { params: patchVoteParamsSchema } },
		deleteVote,
	);
}
