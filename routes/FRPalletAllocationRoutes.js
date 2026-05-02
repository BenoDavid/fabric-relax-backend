// src/routes/stFacilityRouter.js
const FRPalletAllocationController = require('../controllers/FRPalletAllocationController');
const BaseRouter = require('./BaseRouter');

const FRPalletAllocationRouter = new BaseRouter(FRPalletAllocationController);

module.exports = FRPalletAllocationRouter.getRouter();