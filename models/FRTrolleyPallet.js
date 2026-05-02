const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRTrolleyPallet extends Model {
  }

  FRTrolleyPallet.init({
     buyerName : DataTypes.STRING,
      trolleyId : DataTypes.STRING,
      location : DataTypes.STRING,
      facility : DataTypes.INTEGER,
      palletId : DataTypes.STRING,
      trolleyOrPallet : DataTypes.STRING,
      status: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FRTrolleyPallet',
    tableName: 'FRTrolleyPallets',
    timestamps: true,
  });

  return FRTrolleyPallet;
};