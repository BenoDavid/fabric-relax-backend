'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WMSFabricCollection extends Model {
  }
  WMSFabricCollection.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    palletId: DataTypes.STRING,
    invoiceNo: DataTypes.STRING,
    wareHouseId: DataTypes.INTEGER,
    binId: DataTypes.INTEGER,
    location: DataTypes.STRING,

    status: {
      type: DataTypes.STRING,
      defaultValue: "Quarantine"
    },
    totalQty: DataTypes.INTEGER,
    sampleQty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    issuedQty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    balanceQty: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    fabricRef: DataTypes.STRING,
    supplierName: DataTypes.STRING,
    poNo: DataTypes.STRING,
    colorName: DataTypes.STRING,
    ocNo: DataTypes.STRING,
    styleName: DataTypes.STRING,
    shadeLot: DataTypes.STRING,
    rollNo: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'WMSFabricCollection',
    tableName: 'WMSFabricCollections',
    timestamps: true
  });
  return WMSFabricCollection;
};