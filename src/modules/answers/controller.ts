import { FastifyReply, FastifyRequest } from 'fastify';
import {
	CreateAnswerInput,
	GetAnswersByQuestionIdInput,
	GetOneAnswerByQuestionIdInput,
	PatchAnswerInput,
} from './schemas.js';
import { prisma } from '../../utils/prisma.js';

export async function getAllAnswers(
	req: FastifyRequest<{ Params: GetAnswersByQuestionIdInput }>,
	reply: FastifyReply,
) {
	const { questionId } = req.params;

	try {
		const answersByQuestion = await prisma.answer.findMany({
			where: { question_id: questionId },
		});

		if (!answersByQuestion || answersByQuestion.length === 0) {
			return reply.code(401).send({
				message: 'Sem respostas para mostrar',
			});
		}

		return reply.code(200).send(answersByQuestion);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function getAnswer(
	req: FastifyRequest<{ Params: GetOneAnswerByQuestionIdInput }>,
	reply: FastifyReply,
) {
	const { questionId, answerId } = req.params;

	try {
		const answer = await prisma.answer.findUnique({
			where: { question_id: questionId, id: answerId },
		});

		if (!answer) {
			return reply.code(401).send({
				message: `Resposta de id ${answerId} não existe`,
			});
		}

		return reply.code(200).send(answer);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function createAnswer(
	req: FastifyRequest<{
		Body: CreateAnswerInput;
		Params: GetAnswersByQuestionIdInput;
	}>,
	reply: FastifyReply,
) {
	const { user_id, body } = req.body;
	const { questionId } = req.params;

	try {
		const answer = await prisma.answer.create({
			data: {
				question_id: questionId,
				user_id,
				body,
				created_at: new Date(),
				updated_at: new Date(),
				is_best_answer: false,
				is_ai_suggestion: false,
			},
			select: {
				id: true,
				question_id: true,
				user_id: true,
				body: true,
				created_at: true,
				is_ai_suggestion: true,
			},
		});

		return reply.code(201).send(answer);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function patchAnswer(
	req: FastifyRequest<{
		Body: PatchAnswerInput;
		Params: GetOneAnswerByQuestionIdInput;
	}>,
	reply: FastifyReply,
) {
	const { body, is_best_answer } = req.body;
	const { questionId, answerId } = req.params;

	try {
		const answer = await prisma.answer.findUnique({
			where: { question_id: questionId, id: answerId },
		});

		if (!answer) {
			return reply.code(400).send({
				message: `Resposta de id ${answerId} não existe`,
			});
		}

		const edited = await prisma.answer.update({
			data: {
				body,
				is_best_answer,
				updated_at: new Date(),
			},
			where: { question_id: questionId, id: answerId },
		});

		return reply.code(200).send(edited);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function deleteAnswer(
	req: FastifyRequest<{
		Params: GetOneAnswerByQuestionIdInput;
	}>,
	reply: FastifyReply,
) {
	const { questionId, answerId } = req.params;

	try {
		const answer = await prisma.answer.findUnique({
			where: { id: answerId, question_id: questionId },
		});

		if (!answer) {
			return reply.code(400).send({
				message: `Resposta de id ${answerId} não existe`,
			});
		}

		const deleted = await prisma.answer.delete({
			where: { id: answerId, question_id: questionId },
		});
		return reply
			.code(200)
			.send({ message: `Resposta de id ${deleted.id} deletada` });
	} catch (e) {
		return reply.code(500).send(e);
	}
}
