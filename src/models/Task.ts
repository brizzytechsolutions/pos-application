import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/databaseConfig';
import { TaskPriority } from '../enums/taskPriority';
import { TaskStatus } from '../enums/taskStatus';
import User from './User';
import Tag from './Tag';
import TaskTag from './TaggedTask';

class Task extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare dueDate: Date;
  declare priority: TaskPriority;
  declare status: TaskStatus;
  declare userId: number;
  declare updatedBy?: number;
  declare assignedTo?: number;
}

Task.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    title: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    description: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    dueDate: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(TaskPriority)),
      allowNull: false,
      defaultValue: TaskPriority.MEDIUM,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TaskStatus)),
      allowNull: false,
      defaultValue: TaskStatus.OPEN,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' }
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: User, key: 'id' }
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: User, key: 'id' }
    }
  },
  {
    sequelize,
    modelName: 'Task',
    timestamps: true,
  }
);

Task.belongsTo(User, { as: 'creator', foreignKey: 'userId' });
Task.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });

Task.belongsToMany(Tag, { through: TaskTag, as: 'tags', foreignKey: 'taskId', otherKey: 'tagId' });

export default Task;
