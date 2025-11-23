import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma.js';
import {
	CreateQuestionInput,
	GetQuestionByIdInput,
	PatchQuestionInput,
} from './schemas.js';

export async function createQuestion(
	req: FastifyRequest<{ Body: CreateQuestionInput }>,
	reply: FastifyReply,
) {
	const { user_id, topic_id, title, body } = req.body;

	try {
		const question = await prisma.question.create({
			data: {
				user_id,
				topic_id,
				title,
				body,
				is_resolved: false,
				created_at: new Date(),
				updated_at: new Date(),
			},
			select: {
				id: true,
				title: true,
				body: true,
				user_id: true,
				topic_id: true,
				created_at: true,
			},
		});

		return reply.code(201).send(question);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function getAllQuestions(
	req: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const questions = await prisma.question.findMany();

		if (!questions || questions.length === 0) {
			return reply.code(404).send({
				message: 'Sem perguntas para mostrar',
			});
		}

		return reply.code(200).send(questions);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function getQuestion(
	req: FastifyRequest<{ Params: GetQuestionByIdInput }>,
	reply: FastifyReply,
) {
	const { id } = req.params;

	try {
		const question = await prisma.question.findUnique({
			where: { id: id },
		});

		if (!question) {
			return reply.code(400).send({
				message: `Pergunta de id ${id} não existe`,
			});
		}

		return reply.code(200).send(question);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function patchQuestion(
	req: FastifyRequest<{
		Params: GetQuestionByIdInput;
		Body: PatchQuestionInput;
	}>,
	reply: FastifyReply,
) {
	const { topic_id, title, body, is_resolved } = req.body;
	const { id } = req.params;

	try {
		const question = await prisma.question.findUnique({
			where: { id: id },
		});

		if (!question) {
			return reply.code(400).send({
				message: `Pergunta de id ${id} não existe`,
			});
		}

		const edited = await prisma.question.update({
			data: {
				topic_id,
				title,
				body,
				is_resolved,
				updated_at: new Date(),
			},
			where: { id: id },
		});
		return reply.code(200).send(edited);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function deleteQuestion(
	req: FastifyRequest<{
		Params: GetQuestionByIdInput;
	}>,
	reply: FastifyReply,
) {
	const { id } = req.params;

	try {
		const question = await prisma.question.findUnique({
			where: { id: id },
		});

		if (!question) {
			return reply.code(400).send({
				message: `Pergunta de id ${id} não existe`,
			});
		}

		const deleted = await prisma.question.delete({ where: { id: id } });
		return reply
			.code(200)
			.send({ message: `Pergunta de id ${deleted.id} deletada` });
	} catch (e) {
		return reply.code(500).send(e);
	}
}
