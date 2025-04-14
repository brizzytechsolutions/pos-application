export const createTaskSchema = {
  tags: ['Tasks'],
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      dueDate: { type: 'string', format: 'date-time' },
      priority: { type: 'string', enum: ['low', 'medium', 'high'] },
      assignedUserId: { type: 'number' },
      tags: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['title']
  },
  response: {
    201: {
      type: 'object'
    }
  }
};

export const getTasksSchema = {
  tags: ['Tasks'],
  querystring: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['open', 'in progress', 'completed'] },
      sortBy: { type: 'string', enum: ['dueDate', 'priority'] }
    }
  }
};

export const getTaskSchema = {
  tags: ['Tasks'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  }
};

export const updateTaskSchema = {
  tags: ['Tasks'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      dueDate: { type: 'string', format: 'date-time' },
      priority: { type: 'string', enum: ['low', 'medium', 'high'] },
      status: { type: 'string', enum: ['open', 'in progress', 'completed'] },
      assignedUserId: { type: 'number' },
      tags: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  }
};

export const deleteTaskSchema = {
  tags: ['Tasks'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};
