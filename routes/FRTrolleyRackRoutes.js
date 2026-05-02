// src/routes/stFacilityRouter.js
const FRTrolleyRackController = require('../controllers/FRTrolleyRackController');
const BaseRouter = require('./BaseRouter');

const FRTrolleyRackRouter = new BaseRouter(FRTrolleyRackController);

module.exports = FRTrolleyRackRouter.getRouter();