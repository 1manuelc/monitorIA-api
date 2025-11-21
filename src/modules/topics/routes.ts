import { FastifyInstance } from 'fastify';
import {
	createTopicResponseSchema,
	createTopicSchema,
	deleteTopicResponseSchema,
	editTopicResponseSchema,
	editTopicSchema,
	getTopicByIdSchema,
} from './schemas.js';
import {
	createTopic,
	deleteTopic,
	getAllTopics,
	getTopic,
	patchTopic,
} from './controller.js';

export async function topicRoutes(app: FastifyInstance) {
	app.get('/', getAllTopics);

	app.get(
		'/:id',
		{
			schema: {
				params: getTopicByIdSchema,
				response: { 200: createTopicResponseSchema },
			},
		},
		getTopic,
	);

	app.post(
		'/',
		{
			preHandler: [app.authenticate],
			schema: {
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
				params: getTopicByIdSchema,
				body: editTopicSchema,
				response: { 201: editTopicResponseSchema },
			},
		},
		patchTopic,
	);

	app.delete(
		'/:id',
		{
			preHandler: [app.authenticate],
			schema: {
				params: getTopicByIdSchema,
				response: { 200: deleteTopicResponseSchema },
			},
		},
		deleteTopic,
	);
}
