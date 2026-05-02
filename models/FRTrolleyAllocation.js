const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRTrolleyAllocation extends Model {
  }

  FRTrolleyAllocation.init({
      trolleyId : DataTypes.INTEGER ,
      rackNo : DataTypes.STRING ,
      rollId : DataTypes.STRING ,
      buyerName : DataTypes.STRING ,
      allocatedBy : DataTypes.STRING ,
      allocatedAt : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FRTrolleyAllocation',
    tableName: 'FRTrolleyAllocations',
    timestamps: false,
  });

  return FRTrolleyAllocation;
};
   