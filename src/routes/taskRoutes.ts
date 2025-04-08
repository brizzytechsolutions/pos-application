// src/routes/taskRoutes.ts
import { FastifyInstance } from 'fastify';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { createTaskSchema, getTasksSchema, getTaskSchema, updateTaskSchema, deleteTaskSchema } from '../schemas/taskSchemas';

export default async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('preValidation', async (request, reply) => {
    await request.jwtVerify();
  });

  fastify.post('/', { schema: createTaskSchema }, createTask);
  fastify.get('/', { schema: getTasksSchema }, getTasks);
  fastify.get('/:id', { schema: getTaskSchema }, getTaskById);
  fastify.put('/:id', { schema: updateTaskSchema }, updateTask);
  fastify.delete('/:id', { schema: deleteTaskSchema }, deleteTask);
}
