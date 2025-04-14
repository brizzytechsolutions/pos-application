import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/databaseConfig';
import Task from './Task';
import Tag from './Tag';

class TaskTag extends Model {
  public taskId!: number;
  public tagId!: number;
}

TaskTag.init(
  {
    taskId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Task,
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Tag,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'TaskTag'
  }
);

export default TaskTag;
