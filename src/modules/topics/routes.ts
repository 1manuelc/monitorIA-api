import { FastifyInstance } from 'fastify';
import {
	createTopicResponseSchema,
	createTopicSchema,
	deleteTopicResponseSchema,
	editTopicResponseSchema,
	editTopicSchema,
	getAllTopicsResponseSchema,
	getTopicByIdSchema,
} from './schemas.js';
import {
	createTopic,
	deleteTopic,
	getAllTopics,
	getTopic,
	patchTopic,
} from './controller.js';
import { requestErrorMessageSchema } from '../../utils/default-schemas.js';

export async function topicRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			schema: {
				tags: ['Tópicos'],
				description: 'Obtém todos os tópicos, incluindo tópicos-pai',
				response: {
					200: getAllTopicsResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		getAllTopics,
	);

	app.get(
		'/:id',
		{
			schema: {
				tags: ['Tópicos'],
				description: 'Obtém um tópico específico',
				params: getTopicByIdSchema,
				response: {
					200: createTopicResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		getTopic,
	);

	app.post(
		'/',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Tópicos'],
				description: 'Cria um tópico (rota protegida com autenticação)',
				body: createTopicSchema,
				response: { 201: createTopicResponseSchema },
			},
		},
		createTopic,
	);

	app.patch(
		'/:id',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Tópicos'],
				description:
					'Edita um tópico específico (rota protegida com autenticação)',
				params: getTopicByIdSchema,
				body: editTopicSchema,
				response: {
					201: editTopicResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		patchTopic,
	);

	app.delete(
		'/:id',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Tópicos'],
				description:
					'Deleta um tópico específico (rota protegida com autenticação)',
				params: getTopicByIdSchema,
				response: {
					200: deleteTopicResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		deleteTopic,
	);
}
