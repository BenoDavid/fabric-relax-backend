'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FRFabricRelaxs', {
      id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
      },
      rollId : { type: Sequelize.STRING },
      machineId : { type: Sequelize.STRING },
      machineStart : { type: Sequelize.DATE },
      machineEnd : { type: Sequelize.DATE },
      uom : { type: Sequelize.STRING },
      buyerName : { type: Sequelize.STRING },
      fabricContent : { type: Sequelize.STRING },
      machineLoadBy : { type: Sequelize.STRING },
      facility : { type: Sequelize.INTEGER },
      relaxingHours : { type: Sequelize.INTEGER },
      trolleyCode : { type: Sequelize.STRING },
      isActive : { type: Sequelize.BOOLEAN, defaultValue: true },
      status : { type: Sequelize.STRING },
      relaxedBy : { type: Sequelize.STRING },
      relaxedOn : { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FRFabricRelaxs');
  }
};