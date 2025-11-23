import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { CreateUserInput, LoginUserInput } from './schemas.js';
import { prisma } from '../../utils/prisma.js';

const SALT_ROUNDS = 12;

export async function registerUser(
	req: FastifyRequest<{
		Body: CreateUserInput;
	}>,
	reply: FastifyReply,
) {
	const { password, email, username } = req.body;

	const userExists = await prisma.app_user.findUnique({
		where: { email: email },
	});
	if (userExists) {
		return reply.code(400).send({
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
			omit: { password: true },
		});

		return reply.code(201).send(user);
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
		return reply.code(404).send({
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
	return reply.status(200).send({ message: 'Logout bem sucedido' });
}
