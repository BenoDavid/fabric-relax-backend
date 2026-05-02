// src/routes/stFacilityRouter.js
const FRFabricRelaxController = require('../controllers/FRFabricRelaxController');
const BaseRouter = require('./BaseRouter');

const FRFabricRelaxRouter = new BaseRouter(FRFabricRelaxController);

module.exports = FRFabricRelaxRouter.getRouter();