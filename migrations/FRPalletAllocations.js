'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface, Sequelize) {
  await queryInterface.createTable('FRPalletAllocations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    palletId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'FRPallets',
        key: 'id'
      }
    },

    rollId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true   // roll cannot be allocated twice
    },

    buyerName: {
      type: Sequelize.STRING,
      allowNull: false
    },

    allocatedBy: {
      type: Sequelize.STRING
    },

    allocatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
},
   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FRPalletAllocations');
  }
};