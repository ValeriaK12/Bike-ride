'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, { 
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      }),
      Comment.belongsTo(models.Way, { 
        foreignKey: 'way_id',
        onDelete: 'CASCADE'
      })
    }
  }
  Comment.init({
    text: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    way_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
