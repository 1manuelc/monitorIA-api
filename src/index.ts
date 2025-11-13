import Fastify from 'fastify';
import { userRoutes } from './modules/user/routes.js';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/', (req, res) => {
	res.send({ hello: 'world' });
});

app.get('/ping', (_, res) => {
	res.send({ message: 'ping' });
});

// routes
app.register(userRoutes, { prefix: 'api/users' });

app.listen({ port: 3000 }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	app.log.info(`server listening on ${address}`);
});
