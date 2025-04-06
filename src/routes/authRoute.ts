import { FastifyInstance } from 'fastify';
import { login, signUp } from '../controllers/authController';
import { loginSchema, signUpSchema } from '../schemas/authSchemas';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/signup', { schema: signUpSchema }, signUp);
    fastify.post('/login', { schema: loginSchema }, login);
  }