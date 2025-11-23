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
	getAllQuestionsResponseSchema,
	getQuestionByIdSchema,
	patchQuestionSchema,
	questionSchema,
} from './schemas.js';
import {
	deleteMessageSchema,
	requestErrorMessageSchema,
} from '../../utils/default-schemas.js';

export async function questionRoutes(app: FastifyInstance) {
	// TODO: implementar pesquisa por queryString ?search
	app.get(
		'/',
		{
			schema: {
				tags: ['Perguntas'],
				description: 'Obtém todas as perguntas',
				response: {
					200: getAllQuestionsResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		getAllQuestions,
	);

	app.post(
		'/',
		{
			schema: {
				tags: ['Perguntas'],
				description: 'Cria uma pergunta',
				body: createQuestionSchema,
				response: { 201: createQuestionResponseSchema },
			},
		},
		createQuestion,
	);

	app.get(
		'/:id',
		{
			schema: {
				tags: ['Perguntas'],
				description: 'Obtém uma pergunta específica',
				params: getQuestionByIdSchema,
				response: {
					200: questionSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		getQuestion,
	);

	app.patch(
		'/:id',
		{
			schema: {
				tags: ['Perguntas'],
				description: 'Edita uma pergunta específica',
				params: getQuestionByIdSchema,
				body: patchQuestionSchema,
				response: {
					200: questionSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		patchQuestion,
	);

	app.delete(
		'/:id',
		{
			schema: {
				tags: ['Perguntas'],
				description: 'Deleta uma pergunta específica',
				params: getQuestionByIdSchema,
				response: {
					200: deleteMessageSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		deleteQuestion,
	);
}
