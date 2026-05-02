// src/routes/stFacilityRouter.js
const FRPalletController = require('../controllers/FRPalletController');
const BaseRouter = require('./BaseRouter');

const FRPalletRouter = new BaseRouter(FRPalletController);

module.exports = FRPalletRouter.getRouter();