import { FastifyInstance } from 'fastify';
import {
	createAnswerSchema,
	getAnswersByQuestionIdSchema,
	getOneAnswerByQuestionIdSchema,
} from './schemas.js';
import {
	createAnswer,
	deleteAnswer,
	getAllAnswers,
	getAnswer,
	patchAnswer,
} from './controller.js';

export async function answerRoutes(app: FastifyInstance) {
	// lembrar de :questionId na rota base
	app.post(
		'/',
		{
			schema: {
				body: createAnswerSchema,
				params: getAnswersByQuestionIdSchema,
			},
		},
		createAnswer,
	);

	app.get(
		'/',
		{ schema: { params: getAnswersByQuestionIdSchema } },
		getAllAnswers,
	);

	app.get(
		'/:answerId',
		{ schema: { params: getOneAnswerByQuestionIdSchema } },
		getAnswer,
	);

	app.patch(
		'/:answerId',
		{
			schema: { params: getOneAnswerByQuestionIdSchema },
		},
		patchAnswer,
	);

	app.delete(
		'/:answerId',
		{
			schema: { params: getOneAnswerByQuestionIdSchema },
		},
		deleteAnswer,
	);
}
