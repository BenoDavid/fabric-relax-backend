'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
  await queryInterface.createTable('FRPallets', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    palletCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    buyerName: {
      type: Sequelize.STRING,
      allowNull: true   // locked after first allocation
    },

    facility: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    location: {
      type: Sequelize.STRING
    },

    maxCapacity: {
      type: Sequelize.INTEGER,
      defaultValue: 50   // example (configurable)
    },

    status: {
      type: Sequelize.STRING   // EMPTY | PARTIAL | FULL
    },
    
    currentLocation: {
      type: DataTypes.STRING,
    },
    
    isActive: {
      type: DataTypes.BOOLEAN, defaultValue: true,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
},
   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FRPallets');
  }
};