import { FastifyReply, FastifyRequest } from 'fastify';
import {
	CreateVoteInput,
	GetVotesByTargetInput,
	PatchVoteInput,
	PatchVoteParams,
} from './schemas.js';
import { prisma } from '../../utils/prisma.js';

export async function createVote(
	req: FastifyRequest<{ Body: CreateVoteInput }>,
	reply: FastifyReply,
) {
	const { user_id, target_id, target_type, vote_type } = req.body;

	try {
		const user = await prisma.app_user.findUnique({
			where: { id: user_id },
		});

		if (!user) {
			return reply
				.code(400)
				.send({ message: 'Usuário votante inexistente' });
		}

		const target = await prisma[
			(target_type as 'question') || (target_type as 'answer')
		].findUnique({
			where: { id: target_id },
		});

		if (!target) {
			return reply
				.code(400)
				.send({ message: 'Pergunta/resposta inexistente' });
		}

		const vote = await prisma.vote.create({
			data: {
				user_id,
				target_id,
				target_type,
				vote_type,
			},
		});

		return reply.code(201).send(vote);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function getAllVotes(
	req: FastifyRequest<{ Querystring: GetVotesByTargetInput }>,
	reply: FastifyReply,
) {
	const { target_id, target_type, get_value } = req.query;

	try {
		const target = await prisma[
			(target_type as 'question') || (target_type as 'answer')
		].findUnique({
			where: { id: target_id },
		});

		if (!target) {
			return reply
				.code(400)
				.send({ message: 'Pergunta/resposta inexistente' });
		}

		const votes = await prisma.vote.findMany({
			where: { target_id, target_type },
		});

		if (!votes || (!get_value && votes.length === 0)) {
			return reply.code(404).send({
				message: 'Sem votos para mostrar',
			});
		}

		const votesValue = votes
			.map((vote) => vote.vote_type)
			.reduce((v, acc) => v + acc, 0);

		if (get_value) {
			return reply.status(200).send({ value: votesValue });
		}

		return reply.status(200).send(votes);
	} catch (e) {
		return reply.status(500).send(e);
	}
}

export async function patchVote(
	req: FastifyRequest<{ Body: PatchVoteInput; Params: PatchVoteParams }>,
	reply: FastifyReply,
) {
	const { id } = req.params;
	const { vote_type } = req.body;

	try {
		const vote = await prisma.vote.findUnique({
			where: { id },
		});

		if (!vote) {
			return reply.code(404).send({
				message: `Voto de id ${id} não existe`,
			});
		}

		const edited = await prisma.vote.update({
			data: { vote_type },
			where: { id },
		});

		return reply.code(200).send(edited);
	} catch (e) {
		return reply.status(500).send(e);
	}
}

export async function deleteVote(
	req: FastifyRequest<{ Params: PatchVoteParams }>,
	reply: FastifyReply,
) {
	const { id } = req.params;

	try {
		const vote = await prisma.vote.findUnique({
			where: { id },
		});

		if (!vote) {
			return reply.code(404).send({
				message: `Voto de id ${id} não existe`,
			});
		}

		const deleted = await prisma.vote.delete({
			where: { id },
		});
		return reply
			.code(200)
			.send({ message: `Voto de id ${deleted.id} deletado` });
	} catch (e) {
		return reply.status(500).send(e);
	}
}
