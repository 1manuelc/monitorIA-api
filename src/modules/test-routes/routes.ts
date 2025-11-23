import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function testRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			schema: {
				tags: ['Teste'],
				description: 'Rota de teste com Hello World',
				response: {
					200: z.object({ hello: z.string().default('world') }),
				},
			},
		},
		(req: FastifyRequest, res: FastifyReply) => {
			res.send({ hello: 'world' });
		},
	);

	app.get(
		'/ping',
		{
			schema: {
				tags: ['Teste'],
				description: 'Rota de teste com Ping',
				response: {
					200: z.object({ message: z.string().default('ping') }),
				},
			},
		},
		(req: FastifyRequest, res: FastifyReply) => {
			res.send({ message: 'ping' });
		},
	);
}
