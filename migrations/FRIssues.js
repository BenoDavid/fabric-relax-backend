'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FRIssues', {
      id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
      },
      rackId : { type: Sequelize.STRING },
      rollId : { type: Sequelize.STRING },
      issueTo : { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      gdnNo : { type: Sequelize.STRING },
      issuedOn : { type: Sequelize.DATE },
      issuedBy : { type: Sequelize.STRING },
      returnedOn : { type: Sequelize.DATE },
      returnedBy : { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FRIssues');
  }
};