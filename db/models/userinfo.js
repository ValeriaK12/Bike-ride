'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserInfo.belongsTo(models.User, { 
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      })
    }
  }
  UserInfo.init({
    bike: DataTypes.STRING,
    about_me: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
    city: DataTypes.STRING,
    role: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'UserInfo',
  });
  return UserInfo;
};
