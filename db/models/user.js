'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Way, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      }),
      User.hasMany(models.Comment, { 
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      }),
      User.hasOne(models.UserInfo, { 
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      unique: true,
      is: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
