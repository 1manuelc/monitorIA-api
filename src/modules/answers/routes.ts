import { FastifyInstance } from 'fastify';
import {
	answerSchema,
	createAnswerSchema,
	getAllAnswersResponseSchema,
	getAnswersByQuestionIdSchema,
	getOneAnswerByQuestionIdSchema,
	patchAnswerSchema,
} from './schemas.js';
import {
	createAnswer,
	deleteAnswer,
	getAllAnswers,
	getAnswer,
	patchAnswer,
} from './controller.js';
import {
	deleteMessageSchema,
	requestErrorMessageSchema,
} from '../../utils/default-schemas.js';

export async function answerRoutes(app: FastifyInstance) {
	// lembrar de :questionId na rota base
	app.post(
		'/',
		{
			schema: {
				tags: ['Respostas'],
				description: 'Cria uma resposta para uma pergunta',
				body: createAnswerSchema,
				params: getAnswersByQuestionIdSchema,
				response: { 201: answerSchema },
			},
		},
		createAnswer,
	);

	app.get(
		'/',
		{
			schema: {
				tags: ['Respostas'],
				description: 'Obtém todas as resposta de uma pergunta',
				params: getAnswersByQuestionIdSchema,
				response: {
					200: getAllAnswersResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		getAllAnswers,
	);

	app.get(
		'/:answerId',
		{
			schema: {
				tags: ['Respostas'],
				description: 'Obtém uma resposta específica de uma pergunta',
				params: getOneAnswerByQuestionIdSchema,
				response: {
					200: answerSchema,
					400: requestErrorMessageSchema,
				},
			},
		},
		getAnswer,
	);

	app.patch(
		'/:answerId',
		{
			schema: {
				tags: ['Respostas'],
				description: 'Edita uma resposta específica de uma pergunta',
				params: getOneAnswerByQuestionIdSchema,
				body: patchAnswerSchema,
				response: {
					200: answerSchema,
					400: requestErrorMessageSchema,
				},
			},
		},
		patchAnswer,
	);

	app.delete(
		'/:answerId',
		{
			schema: {
				tags: ['Respostas'],
				description: 'Deleta uma resposta específica de uma pergunta',
				params: getOneAnswerByQuestionIdSchema,
				response: {
					200: deleteMessageSchema,
					400: requestErrorMessageSchema,
				},
			},
		},
		deleteAnswer,
	);
}
