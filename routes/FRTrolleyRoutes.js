// src/routes/stFacilityRouter.js
const FRTrolleyController = require('../controllers/FRTrolleyController');
const BaseRouter = require('./BaseRouter');

const FRTrolleyRouter = new BaseRouter(FRTrolleyController);

module.exports = FRTrolleyRouter.getRouter();