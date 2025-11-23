import { FastifyReply, FastifyRequest } from 'fastify';

import { prisma } from '../../utils/prisma.js';
import { GetOneUserInput, PatchUserInput } from './schemas.js';
import bcrypt from 'bcrypt';

export async function getAllUsers(req: FastifyRequest, reply: FastifyReply) {
	try {
		const users = await prisma.app_user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
			},
		});

		if (!users || users.length === 0) {
			return reply.code(404).send({
				message: 'Sem usuários para mostrar',
			});
		}

		return reply.code(200).send(users);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function getUser(
	req: FastifyRequest<{ Params: GetOneUserInput }>,
	reply: FastifyReply,
) {
	const { id } = req.params;

	try {
		const user = await prisma.app_user.findUnique({
			where: { id: id },
		});

		if (!user) {
			return reply.code(404).send({
				message: `Usuário de id ${id} não existe`,
			});
		}

		return reply.code(200).send(user);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function patchUser(
	req: FastifyRequest<{
		Body: PatchUserInput;
		Params: GetOneUserInput;
	}>,
	reply: FastifyReply,
) {
	const { username, role, email } = req.body;
	const { id } = req.params;

	try {
		const user = await prisma.app_user.findUnique({
			where: { id: id },
		});

		if (!user) {
			return reply.code(404).send({
				message: `Usuário de id ${id} não existe`,
			});
		}

		const edited = await prisma.app_user.update({
			data: { username, role, email },
			where: { id: id },
		});
		return reply.code(200).send(edited);
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function deleteUser(
	req: FastifyRequest<{ Params: GetOneUserInput }>,
	reply: FastifyReply,
) {
	const { id } = req.params;

	try {
		const user = await prisma.app_user.findUnique({
			where: { id },
		});

		if (!user) {
			return reply.code(404).send({
				message: `Usuário de id ${id} não existe`,
			});
		}

		const deleted = await prisma.app_user.delete({
			where: { id },
		});
		return reply
			.code(200)
			.send({ message: `Usuário de id ${deleted.id} deletado` });
	} catch (e) {
		return reply.status(500).send(e);
	}
}
