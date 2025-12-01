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
import { questionRoutes } from './modules/questions/routes.js';
import { answerRoutes } from './modules/answers/routes.js';
import { voteRoutes } from './modules/votes/routes.js';

import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { authRoutes } from './modules/auth/routes.js';
import { aiRoutes } from './modules/ai/routes.js';
import fastifyCors from '@fastify/cors';

const app = Fastify({
	logger: {
		level: process.env.LOGGER_LEVEL ?? undefined,
		enabled: !!process.env.LOGGER_LEVEL,
	},
}).withTypeProvider<ZodTypeProvider>();

await app.register(fastifyCors, {
	origin: ['http://localhost:5173'],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	exposedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
});

app.register(swagger, {
	openapi: {
		info: {
			title: 'MonitorIA API',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform, // ⭐ transforma Zod → JSON Schema
});
app.register(swaggerUI, {
	routePrefix: '/docs',
});

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

app.register(testRoutes, { prefix: '/api' });
app.register(authRoutes, { prefix: '/api/auth' });
app.register(userRoutes, { prefix: '/api/users' });
app.register(topicRoutes, { prefix: '/api/topics' });
app.register(questionRoutes, { prefix: '/api/questions' });
app.register(voteRoutes, { prefix: '/api/votes' });
app.register(answerRoutes, { prefix: '/api/questions/:questionId/answers' });
app.register(aiRoutes, { prefix: '/api/ai' });

app.listen({ port: 3000 }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`🤖 MonitorIA-API rodando em ${address}/api/`);
	console.log(`📘 Swagger docs: ${address}/docs`);
});
