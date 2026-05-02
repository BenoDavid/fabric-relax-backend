'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
  await queryInterface.createTable('FRTrolleyAllocations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    trolleyId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    rackNo: {
      type: Sequelize.STRING,
      allowNull: false
    },

    rollId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
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
    await queryInterface.dropTable('FRTrolleyAllocations');
  }
};