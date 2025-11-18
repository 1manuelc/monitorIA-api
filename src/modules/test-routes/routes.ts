import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function testRoutes(app: FastifyInstance) {
	app.get('/', (req: FastifyRequest, res: FastifyReply) => {
		res.send({ hello: 'world' });
	});

	app.get('/ping', (req: FastifyRequest, res: FastifyReply) => {
		res.send({ message: 'ping' });
	});
}
