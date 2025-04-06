import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/databaseConfig';
import bcrypt from 'bcrypt'

class User extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
              }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
        hooks: {
            beforeCreate: async (user: User) => {
              const salt = await bcrypt.genSalt(10)
              user.password = await bcrypt.hash(user.password, salt)
            }
          }
    } 
);

export default User;