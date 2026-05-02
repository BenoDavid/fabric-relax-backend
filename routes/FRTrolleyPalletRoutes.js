// src/routes/stFacilityRouter.js
const FRTrolleyPalletController = require('../controllers/FRTrolleyPalletController');
const BaseRouter = require('./BaseRouter');

const FRTrolleyPalletRouter = new BaseRouter(FRTrolleyPalletController);

module.exports = FRTrolleyPalletRouter.getRouter();