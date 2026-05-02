// src/routes/stFacilityRouter.js
const FRMachineController = require('../controllers/FRMachineController');
const BaseRouter = require('./BaseRouter');

const FRMachineRouter = new BaseRouter(FRMachineController);

module.exports = FRMachineRouter.getRouter();