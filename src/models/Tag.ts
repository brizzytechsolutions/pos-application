// src/models/tag.ts
import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db/databaseConfig'

class Tag extends Model {
  public id!: number
  public name!: string
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'tag'
  }
)

export default Tag;