import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma.js';
import { generateAIAnswer } from '../../utils/groq.js';
import { GetQuestionByIdInput } from './schemas.js';

export async function suggestAIAnswer(
	req: FastifyRequest<{ Params: GetQuestionByIdInput }>,
	reply: FastifyReply,
) {
	const { questionId } = req.params;

	try {
		const question = await prisma.question.findUnique({
			where: { id: questionId },
			include: { topic: true },
		});

		if (!question) {
			return reply.code(404).send({
				message: `Pergunta de id ${questionId} não existe.`,
			});
		}

		if (!question.topic) {
			return reply.code(400).send({
				message: `Tópico da pergunta de id ${questionId} não encontrado.`,
			});
		}

		const aiAnswerBody = await generateAIAnswer(
			`${question.title}\n${question.body}`,
			question.topic.name,
		);

		const answer = await prisma.answer.create({
			data: {
				question_id: question.id,
				user_id: undefined,
				body: aiAnswerBody,
				created_at: new Date(),
				updated_at: new Date(),
				is_best_answer: false,
				is_ai_suggestion: true,
			},
			omit: {
				updated_at: true,
				is_best_answer: true,
			},
		});

		return reply.code(201).send({
			message: 'Sugestão de resposta de IA gerada com sucesso.',
			answer: answer,
		});
	} catch (e) {
		console.error('Erro ao gerar sugestão de IA:', e);
		return reply.code(500).send({
			message:
				'Ocorreu um erro interno ao tentar gerar a sugestão de IA.',
		});
	}
}
