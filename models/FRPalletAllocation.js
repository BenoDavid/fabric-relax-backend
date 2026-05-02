const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRPalletAllocation extends Model {
  }

  FRPalletAllocation.init({
     palletId : DataTypes.STRING ,
      rollId : DataTypes.STRING ,
      buyerName : DataTypes.STRING ,
      allocatedBy : DataTypes.STRING ,
      allocatedAt : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FRPalletAllocation',
    tableName: 'FRPalletAllocations',
    timestamps: true,
  });

  return FRPalletAllocation;
};
   