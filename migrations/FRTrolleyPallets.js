'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FRTrolleyPallets', {
      id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
      },
      buyerName : { type: Sequelize.STRING },
      trolleyId : { type: Sequelize.STRING },
      location : { type: Sequelize.STRING },
      facility : { type: Sequelize.INTEGER },
      palletId : { type: Sequelize.STRING },
      trolleyOrPallet : { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FRTrolleyPallets');
  }
};