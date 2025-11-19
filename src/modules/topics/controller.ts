import { FastifyReply, FastifyRequest } from 'fastify';
import {
	CreateTopicInput,
	DeleteTopicInput,
	EditTopicInput,
	GetTopicByIdInput,
} from './schemas.js';
import { prisma } from '../../utils/prisma.js';

export async function createTopic(
	req: FastifyRequest<{
		Body: CreateTopicInput;
	}>,
	reply: FastifyReply,
) {
	const { name, description, parent_id } = req.body;

	const sameNameTopic = await prisma.topic.findFirst({
		where: { name: name },
	});

	if (sameNameTopic) {
		return reply.code(401).send({
			message: 'Ja existe um topico registrado com este nome',
		});
	}

	try {
		const topic = await prisma.topic.create({
			data: { name, description, parent_id },
			select: {
				id: true,
				name: true,
				description: true,
				parent_id: true,
			},
		});

		console.log(topic);

		return reply.code(201).send({
			id: topic.id,
			name: topic.name,
			parent_id: topic.parent_id,
			description: topic.description,
		});
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function getAllTopics(req: FastifyRequest, reply: FastifyReply) {
	try {
		const topics = await prisma.topic.findMany({
			include: { other_topic: true },
		});

		if (!topics || topics.length === 0) {
			return reply.code(401).send({
				message: 'Sem tópicos para mostrar',
			});
		}

		return reply.code(200).send(topics);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function getTopic(
	req: FastifyRequest<{ Params: GetTopicByIdInput }>,
	reply: FastifyReply,
) {
	const { id } = req.params;

	try {
		const topic = await prisma.topic.findUnique({
			where: { id: id },
		});

		if (!topic) {
			return reply.code(401).send({
				message: `Tópico de id ${id} não existe`,
			});
		}

		return reply.code(200).send(topic);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function patchTopic(
	req: FastifyRequest<{
		Body: EditTopicInput;
	}>,
	reply: FastifyReply,
) {
	const { id, name, description, parent_id } = req.body;
	const topic = await prisma.topic.findUnique({
		where: { id: id },
	});

	if (!topic) {
		return reply.code(401).send({
			message: `Tópico de id ${id} não existe`,
		});
	}

	const edited = await prisma.topic.update({
		data: { name, description, parent_id },
		where: { id: id },
	});
	return reply.code(200).send(edited);
}

export async function deleteTopic(
	req: FastifyRequest<{
		Body: DeleteTopicInput;
	}>,
	reply: FastifyReply,
) {
	const { id } = req.body;
	const topic = await prisma.topic.findUnique({
		where: { id: id },
	});

	if (!topic) {
		return reply.code(401).send({
			message: `Tópico de id ${id} não existe`,
		});
	}

	const deleted = await prisma.topic.delete({ where: { id: id } });
	return reply.code(200).send({ msg: `Tópico de id ${deleted.id} deletado` });
}
