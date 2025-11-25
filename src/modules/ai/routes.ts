import { FastifyInstance } from 'fastify';
import { suggestAIAnswer } from './controller.js';
import {
	getQuestionByIdSchema,
	aiSuggestionResponseSchema,
	aiSuggestionErrorSchema,
} from './schemas.js';

export async function aiRoutes(app: FastifyInstance) {
	app.post(
		'/suggest/:questionId',
		{
			schema: {
				tags: ['Inteligência Artificial'],
				description:
					'Gera e salva uma sugestão de resposta de IA para uma pergunta específica.',
				params: getQuestionByIdSchema,
				response: {
					201: aiSuggestionResponseSchema,
					400: aiSuggestionErrorSchema,
					404: aiSuggestionErrorSchema,
					500: aiSuggestionErrorSchema,
				},
			},
		},
		suggestAIAnswer,
	);
}
