import { FastifyInstance } from 'fastify';
import {
	createUserResponseSchema,
	createUserSchema,
	loginResponseSchema,
	loginSchema,
} from './schemas.js';
import {
	deleteMessageSchema,
	requestErrorMessageSchema,
} from '../../utils/default-schemas.js';
import { login, logout, registerUser } from './controller.js';

export async function authRoutes(app: FastifyInstance) {
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
		registerUser,
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

	app.log.info('auth routes registered');
}
