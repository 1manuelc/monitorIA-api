import { FastifyInstance } from 'fastify';
import {
	createQuestion,
	deleteQuestion,
	getAllQuestions,
	getQuestion,
	patchQuestion,
} from './controller.js';
import {
	createQuestionResponseSchema,
	createQuestionSchema,
	getQuestionByIdSchema,
	patchQuestionSchema,
} from './schemas.js';

export async function questionRoutes(app: FastifyInstance) {
	app.get('/', getAllQuestions);

	app.post(
		'/',
		{
			schema: {
				body: createQuestionSchema,
				response: { 201: createQuestionResponseSchema },
			},
		},
		createQuestion,
	);

	app.get('/:id', { schema: { params: getQuestionByIdSchema } }, getQuestion);

	app.patch(
		'/:id',
		{
			schema: {
				params: getQuestionByIdSchema,
				body: patchQuestionSchema,
			},
		},
		patchQuestion,
	);

	app.delete(
		'/:id',
		{ schema: { params: getQuestionByIdSchema } },
		deleteQuestion,
	);
}
