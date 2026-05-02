const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRTrolley extends Model {
  static associate(models) {
    FRTrolley.hasMany(models.FRTrolleyRack, {
      foreignKey: 'trolleyId',
      sourceKey: 'id',          // IMPORTANT if trolleyId is INTEGER FK
      as: 'racks',
      constraints: true         // enforce FK at DB level
    });
  }

  }

  FRTrolley.init({
      trolleyId : DataTypes.STRING,
      buyerName : DataTypes.STRING,
      facility : DataTypes.INTEGER,
      location : DataTypes.STRING,
      capacity : DataTypes.INTEGER,
      status: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FRTrolley',
    tableName: 'FRTrolleys',
    timestamps: true,
  });

  return FRTrolley;
};