const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FREarlyIssue extends Model {
  }

  FREarlyIssue.init({
      rollId : DataTypes.STRING,
      status: DataTypes.STRING,
      requestedOn : DataTypes.DATE,
      requestedBy : DataTypes.STRING,
      approvedOn : DataTypes.DATE,
      approvedBy : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'FREarlyIssue',
    tableName: 'FREarlyIssues',
    timestamps: false,
  });

  return FREarlyIssue;
};