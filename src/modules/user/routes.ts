import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
	createUserResponseSchema,
	createUserSchema,
	loginResponseSchema,
	loginSchema,
} from './schemas.js';

export async function userRoutes(app: FastifyInstance) {
	app.get('/', (req: FastifyRequest, reply: FastifyReply) => {
		reply.send({ message: '/ route hit' });
	});
	app.post(
		'/register',
		{
			schema: {
				body: createUserSchema,
				response: {
					201: createUserResponseSchema,
				},
			},
		},
		() => {},
	);
	app.post(
		'/login',
		{
			schema: {
				body: loginSchema,
				response: {
					201: loginResponseSchema,
				},
			},
		},
		() => {},
	);
	app.delete('/logout', () => {});
	app.log.info('user routes registered');
}
