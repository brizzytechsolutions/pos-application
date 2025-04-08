import { FastifyReply, FastifyRequest } from 'fastify';
import Task from '../models/Task';
import Tag from '../models/Tag';

const createTask = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    const { title, description, dueDate, priority, assignedUserId, tags } =
      request.body as {
        title: string;
        description?: string;
        dueDate?: string;
        priority?: string;
        assignedUserId?: number;
        tags?: string[];
      };
  
    try {
      const task = await Task.create({ 
        title, 
        description, 
        dueDate, 
        priority, 
        userId: user.id,
        assignedTo: assignedUserId 
      });
      
      if (tags && tags.length) {
        const tagInstances = await Promise.all(
          tags.map(async (label) => {
            const [tag] = await Tag.findOrCreate({ where: { label } });
            return tag;
          })
        );
        await task.set('Tags', tagInstances);
      }
      return reply.code(201).send(task);
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  };
  

  const getTasks = async (request: FastifyRequest, reply: FastifyReply) => {
    const { status, sortBy } = request.query as { status?: string; sortBy?: string };
    const user = (request as any).user;
    try {
      const tasks = await Task.findAll({
        where: { assignedTo: user.id },
        order: sortBy ? [[sortBy, 'ASC']] : undefined,
      });
      return reply.send(tasks);
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  };
  

  const getTaskById = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user; 
    const { id } = request.params as { id: string };
    
    try {
      const task = await Task.findByPk(id);
      if (!task) return reply.code(404).send({ error: 'Task not found' });
      
      if (task.assignedTo !== user.id && task.userId !== user.id) {
        return reply.code(403).send({ error: 'Access denied' });
      }
      
      return reply.send(task);
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  };
  

const updateTask = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const { title, description, dueDate, priority, status, assignedUserId, tags } =
      request.body as {
        title?: string;
        description?: string;
        dueDate?: string;
        priority?: string;
        status?: string;
        assignedUserId?: number;
        tags?: string[];
      };
  
    try {
      const task = await Task.findByPk(id);
      if (!task) return reply.code(404).send({ error: 'Task not found' });
      
      await task.update({ 
        title, 
        description, 
        dueDate, 
        priority, 
        status, 
        assignedTo: assignedUserId,
        updatedBy: user.id
      });
      
      if (tags) {
        const tagInstances = await Promise.all(
          tags.map(async (label) => {
            const [tag] = await Tag.findOrCreate({ where: { label } });
            return tag;
          })
        );
        await task.set('Tags', tagInstances);
      }
      return reply.send(task);
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  };
  

  const deleteTask = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    try {
      const task = await Task.findByPk(id);
      if (!task) return reply.code(404).send({ error: 'Task not found' });
      
      console.log(`Task ${id} deleted by user ${user.id}`);
      
      await task.destroy();
      return reply.send({ message: 'Task deleted' });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  };
  

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
