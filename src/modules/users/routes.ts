import { FastifyInstance } from 'fastify';
import {
	getOneUserSchema,
	getUsersSchema,
	patchUserSchema,
	userSchema,
} from './schemas.js';
import { deleteUser, getAllUsers, getUser, patchUser } from './controller.js';
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

	app.get(
		'/:id',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Usuários'],
				description:
					'Obtém um usuário específico (rota protegida com autenticação)',
				params: getOneUserSchema,
				response: {
					200: userSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		getUser,
	);

	app.patch(
		'/:id',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Usuários'],
				description:
					'Edita um usuário específico (rota protegida com autenticação)',
				params: getOneUserSchema,
				body: patchUserSchema,
				response: {
					200: userSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		patchUser,
	);

	app.delete(
		'/:id',
		{
			preHandler: [app.authenticate],
			schema: {
				tags: ['Usuários'],
				description:
					'Deleta um usuário específico (rota protegida com autenticação)',
				params: getOneUserSchema,
				response: {
					200: deleteMessageSchema,
					404: requestErrorMessageSchema,
				},
			},
		},
		deleteUser,
	);

	app.log.info('user routes registered');
}
