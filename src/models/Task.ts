import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/databaseConfig';
import { TaskPriority } from '../enums/taskPriority';
import { TaskStatus } from '../enums/taskStatus';
import User from './User';

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public dueDate!: Date;
  public priority!: TaskPriority;
  public status!: TaskStatus;
  public userId!: number;       
  public updatedBy?: number; 
  public assignedTo?: number;  
}

Task.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    dueDate: { type: DataTypes.DATE, allowNull: true },
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

export default Task;
