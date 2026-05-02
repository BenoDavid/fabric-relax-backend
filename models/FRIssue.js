const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FRIssue extends Model {
  }

  FRIssue.init({
      rackId : DataTypes.STRING,
      rollId : DataTypes.STRING,
      issueTo : DataTypes.STRING,
      status: DataTypes.STRING,
      gdnNo : DataTypes.STRING,
      issuedOn : DataTypes.DATE,
      issuedBy : DataTypes.STRING,
      returnedOn : DataTypes.DATE,
      returnedBy : DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FRIssue',
    tableName: 'FRIssues',
    timestamps: true,
  });

  return FRIssue;
};