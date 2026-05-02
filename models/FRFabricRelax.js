const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRFabricRelax extends Model {
    static associate(models) {
     
      FRFabricRelax.hasOne(models.WMSFabricCollection, {
        sourceKey: 'rollId',
        foreignKey: 'id',
        as: 'fabric'
      }); 
    }
  }

  FRFabricRelax.init({
      rollId : DataTypes.STRING,
      machineId : DataTypes.STRING,
      machineStart : DataTypes.DATE,
      machineEnd : DataTypes.DATE,
      uom : DataTypes.STRING,
      buyerName : DataTypes.STRING,
      fabricContent : DataTypes.STRING,
      machineLoadBy : DataTypes.STRING,
      facility : DataTypes.INTEGER,
      relaxingHours : DataTypes.INTEGER,
      trolleyCode : DataTypes.STRING,
      isActive : { type: DataTypes.BOOLEAN, defaultValue: true },
      status : DataTypes.STRING,
      relaxedBy : DataTypes.STRING,
      relaxedOn : DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'FRFabricRelax',
    tableName: 'FRFabricRelaxs',
    timestamps: true,
  });

  return FRFabricRelax;
};