import { FastifyReply, FastifyRequest } from 'fastify';
import Task from '../models/Task';
import Tag from '../models/Tag';
import User from '../models/User';

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
    if (assignedUserId) {
      const assignedUser = await User.findByPk(assignedUserId);
      if (!assignedUser) {
        return reply.code(400).send({ error: 'Assigned user not found' });
      }
    }

    const task = await Task.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      userId: user.id,
      assignedTo: assignedUserId
    });

    if (tags && tags.length) {
      const tagInstances = await Promise.all(
        tags.map(async (label) => {
          const [tag] = await Tag.findOrCreate({
            where: { label },
            defaults: { label }
          });
          return tag;
        })
      );
      await (task as any).addTags(tagInstances);
    }

    const createdTask = await Task.findByPk(task.id, {
      include: [
        { model: Tag, as: 'tags' },
        { model: User, as: 'creator', attributes: ['id', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'email'] }
      ]
    });

    if (!createdTask) {
      return reply.code(500).send({ error: 'Internal Server Error', details: 'Created task not found' });
    }

    const taskJson = createdTask.toJSON();
    taskJson.updatedAt = null;
    taskJson.updatedBy = null;

    return reply.code(201).send(taskJson);
  } catch (error) {
    console.error("Create Task Error:", error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

const getTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  const { status, sortBy } = request.query as { status?: string; sortBy?: string };
  const user = (request as any).user;

  try {
    const whereClause: any = { assignedTo: user.id };

    if (status) {
      whereClause.status = status;
    }

    let orderOption: [string, 'ASC' | 'DESC'][] | undefined;
    const allowedSortFields = ['dueDate', 'priority'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      orderOption = [[sortBy, 'ASC']];
    }

    const tasks = await Task.findAll({
      where: whereClause,
      order: orderOption,
      include: [
        { model: Tag, through: { attributes: [] } },
        { model: User, as: 'creator', attributes: ['id', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'email'] }
      ]
    });
    return reply.send(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

const getTaskById = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = (request as any).user; 
  const { id } = request.params as { id: string };
  
  try {
    const task = await Task.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'email'] }
      ]
    });
    if (!task) return reply.code(404).send({ error: 'Task not found' });
    
    if (task.assignedTo !== user.id && task.userId !== user.id) {
      return reply.code(403).send({ error: 'Access denied' });
    }
    
    const taskJson = task.toJSON();

    if (taskJson.createdAt === taskJson.updatedAt) {
      taskJson.updatedAt = null;
    }
    
    if (!taskJson.updatedBy) {
      taskJson.updatedBy = taskJson.creator ? taskJson.creator.email : null;
    }

    return reply.send(taskJson);
  } catch (error) {
    console.error("Get Task By Id Error:", error);
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
    console.error("Update Task Error:", error);
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
    console.error("Delete Task Error:", error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
