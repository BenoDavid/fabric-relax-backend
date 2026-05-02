const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRTrolleyRack extends Model {
  static associate(models) {
    FRTrolleyRack.belongsTo(models.FRTrolley, {
      foreignKey: 'trolleyId',
      targetKey: 'id',
      as: 'trolley',
      constraints: true
    });
  }


  }

  FRTrolleyRack.init({
      trolleyId : DataTypes.STRING,
      rackNo : DataTypes.STRING,
      isOccupied : DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FRTrolleyRack',
    tableName: 'FRTrolleyRacks',
    timestamps: true,
  });

  return FRTrolleyRack;
};