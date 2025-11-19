import { FastifyInstance } from 'fastify';
import {
	createTopicResponseSchema,
	createTopicSchema,
	deleteTopicResponseSchema,
	deleteTopicSchema,
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
		'/',
		{
			preHandler: [app.authenticate],
			schema: {
				body: editTopicSchema,
				response: { 201: editTopicResponseSchema },
			},
		},
		patchTopic,
	);

	app.delete(
		'/',
		{
			preHandler: [app.authenticate],
			schema: {
				body: deleteTopicSchema,
				response: { 200: deleteTopicResponseSchema },
			},
		},
		deleteTopic,
	);
}
