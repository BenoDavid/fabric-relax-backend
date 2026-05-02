const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRMachine extends Model {
  }

  FRMachine.init({
     machineId : DataTypes.STRING ,
      machineType : DataTypes.STRING ,
      facility : DataTypes.INTEGER ,
      description : DataTypes.STRING ,
      status: DataTypes.STRING ,
      createdAt: DataTypes.DATE ,
      updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FRMachine',
    tableName: 'FRMachines',
    timestamps: true,
  });

  return FRMachine;
};