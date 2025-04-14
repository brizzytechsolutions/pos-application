import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/databaseConfig';

class Tag extends Model {
  declare id: number;
  declare label: string;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'Tag',
    timestamps: true
  }
);

export default Tag;
