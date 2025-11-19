import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { prisma } from '../../utils/prisma.js';
import { CreateUserInput, LoginUserInput } from './schemas.js';

const SALT_ROUNDS = 12;

export async function createUser(
	req: FastifyRequest<{
		Body: CreateUserInput;
	}>,
	reply: FastifyReply,
) {
	const { password, email, username } = req.body;

	const user = await prisma.app_user.findUnique({
		where: { email: email },
	});
	if (user) {
		return reply.code(401).send({
			message: 'Ja existe um usuario registrado com este e-mail',
		});
	}

	try {
		const hash = await bcrypt.hash(password, SALT_ROUNDS);
		const user = await prisma.app_user.create({
			data: {
				password: hash,
				email,
				username,
			},
		});

		return reply
			.code(201)
			.send({ id: user.id, email: user.email, username: user.username });
	} catch (e) {
		return reply.code(500).send(e);
	}
}

export async function login(
	req: FastifyRequest<{
		Body: LoginUserInput;
	}>,
	reply: FastifyReply,
) {
	const { email, password } = req.body;
	const user = await prisma.app_user.findUnique({ where: { email: email } });

	const isMatch = user && (await bcrypt.compare(password, user.password));
	if (!user || !isMatch) {
		return reply.code(401).send({
			message: 'E-mail ou senha invalidos',
		});
	}

	const payload = {
		id: user.id,
		email: user.email,
		username: user.username,
	};
	const token = req.jwt.sign(payload);
	reply.setCookie('access_token', token, {
		path: '/',
		httpOnly: true,
		secure: true,
	});

	return { accessToken: token };
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
	reply.clearCookie('access_token');
	return reply.send({ message: 'Logout bem sucedido' });
}

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
			return reply.code(401).send({
				message: 'Sem usuários para mostrar',
			});
		}

		return reply.code(200).send(users);
	} catch (e) {
		return reply.code(500).send(e);
	}
}
