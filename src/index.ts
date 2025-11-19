import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { userRoutes } from './modules/users/routes.js';
import {
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from 'fastify-type-provider-zod';

import 'dotenv/config';
import fjwt, { FastifyJWT } from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import { testRoutes } from './modules/test-routes/routes.js';
import { topicRoutes } from './modules/topics/routes.js';

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.register(fjwt, {
	secret: process.env.JWT_SECRET || 'super-secret',
});
app.addHook('preHandler', (req, res, next) => {
	req.jwt = app.jwt;
	return next();
});
app.register(fCookie, {
	secret: process.env.COOKIE_SECRET || 'cookie-super-secret',
	hook: 'preHandler',
});
app.decorate(
	'authenticate',
	async (req: FastifyRequest, reply: FastifyReply) => {
		const token = req.cookies.access_token;
		if (!token) {
			return reply
				.status(401)
				.send({ message: 'Autenticacao necessaria' });
		}

		const decoded = req.jwt.verify<FastifyJWT['user']>(token);
		req.user = decoded;
	},
);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(testRoutes, { prefix: 'api/' });
app.register(userRoutes, { prefix: 'api/users' });
app.register(topicRoutes, { prefix: 'api/topics' });

app.listen({ port: 3000 }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	app.log.info(`server listening on ${address}`);
});
