const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRPallet extends Model {
  }

  FRPallet.init(
    {
      palletCode: DataTypes.STRING,
      buyerName: DataTypes.STRING,
      facility: DataTypes.INTEGER,
      location: DataTypes.STRING,
      maxCapacity: DataTypes.INTEGER,
      status: DataTypes.STRING,
      currentLocation: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "FRPallet",
      tableName: "FRPallets",
      timestamps: true,
    },
  );

  return FRPallet;
};
   