import fastify, { FastifyRegisterOptions } from 'fastify';
import dotenv from 'dotenv';
import { testConnection } from './db/databaseConfig';
import swagger, { SwaggerOptions } from '@fastify/swagger'; // Import SwaggerOptions
import swaggerUI from '@fastify/swagger-ui';
import fastifyJwt from '@fastify/jwt';
import authRoutes from './routes/authRoute';

dotenv.config();

const app = fastify({
  logger: true,
});

app.register(swagger, {
  swagger: {
    info: {
      title: 'POS API',
      description: 'API documentation for the Point-of-Sales Assessment System',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true,
  routePrefix: '/documentation',
} as FastifyRegisterOptions<SwaggerOptions>);

app.register(swaggerUI, {
  routePrefix: '/api/v1',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true
});

app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });

app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

app.register(authRoutes, { prefix: '/auth' });

const start = async () => {
  try {
    await testConnection();
    await app.listen({ port: parseInt(process.env.PORT || '3000'), host: '0.0.0.0' });
    console.log(`Server listening on port ${process.env.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

export default app;