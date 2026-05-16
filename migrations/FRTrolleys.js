"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FRTrolleys", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      trolleyId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      buyerName: {
        type: Sequelize.STRING,
        allowNull: true, // NULL until first roll allocated
      },

      facility: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      location: {
        type: Sequelize.STRING,
      },

      capacity: {
        type: Sequelize.INTEGER,
        defaultValue: 12,
      },

      status: {
        type: Sequelize.STRING, // EMPTY | PARTIAL | FULL
      },
      currentLocation: {
      type: DataTypes.STRING,
      },
    
    isActive: {
      type: DataTypes.BOOLEAN, defaultValue: true,
    },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FRTrolleys");
  },
};
