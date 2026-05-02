'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FREarlyIssues', {
      id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
      },
      rollId : { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      requestedOn : { type: Sequelize.DATE },
      requestedBy : { type: Sequelize.STRING },
      approvedOn : { type: Sequelize.DATE },
      approvedBy : { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FREarlyIssues');
  }
};