import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
	createUserResponseSchema,
	createUserSchema,
	getUsersSchema,
	loginResponseSchema,
	loginSchema,
} from './schemas.js';
import { createUser, getAllUsers, login, logout } from './controller.js';
import {
	deleteMessageSchema,
	requestErrorMessageSchema,
} from '../../utils/default-schemas.js';

export async function userRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Usuários'],
				description:
					'Obtém todos os usuários cadastrados (rota protegida com autenticação)',
				response: {
					200: getUsersSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		getAllUsers,
	);

	app.post(
		'/register',
		{
			schema: {
				tags: ['Autenticação'],
				description: 'Registra um usuário',
				body: createUserSchema,
				response: {
					201: createUserResponseSchema,
					400: requestErrorMessageSchema,
				},
			},
		},
		createUser,
	);

	app.post(
		'/login',
		{
			schema: {
				tags: ['Autenticação'],
				description:
					'Autentica um usuário inserindo um cookie na resposta',
				body: loginSchema,
				response: {
					201: loginResponseSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		login,
	);

	app.delete(
		'/logout',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Autenticação'],
				description:
					'Faz logout do usuário removendo o token de acesso dos cookies',
				response: { 200: deleteMessageSchema },
			},
		},
		logout,
	);

	app.log.info('user routes registered');
}
