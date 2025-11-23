import { FastifyInstance } from 'fastify';
import {
	createVoteResponseSchema,
	createVoteSchema,
	getVotesByTargetResponse,
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
import {
	requestErrorMessageSchema,
	deleteMessageSchema,
} from '../../utils/default-schemas.js';

export async function voteRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			schema: {
				tags: ['Votos'],
				description:
					'Obtém todos os votos ou o valor total de votos de uma pergunta ou resposta',
				querystring: getVotesByTargetSchema,
				response: {
					200: getVotesByTargetResponse,
					400: requestErrorMessageSchema,
				},
			},
		},
		getAllVotes,
	);

	app.post(
		'/',
		{
			schema: {
				tags: ['Votos'],
				description: 'Cria um voto em uma pergunta ou resposta',
				body: createVoteSchema,
				response: {
					200: createVoteResponseSchema,
					400: requestErrorMessageSchema,
				},
			},
		},
		createVote,
	);

	app.patch(
		'/:id',
		{
			schema: {
				tags: ['Votos'],
				description:
					'Edita o valor de um voto específico em uma pergunta ou resposta',
				body: patchVoteBodySchema,
				params: patchVoteParamsSchema,
				response: {
					200: createVoteResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		patchVote,
	);

	app.delete(
		'/:id',
		{
			schema: {
				tags: ['Votos'],
				description:
					'Deleta um voto específico de uma pergunta ou resposta',
				params: patchVoteParamsSchema,
				response: {
					200: deleteMessageSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		deleteVote,
	);
}
