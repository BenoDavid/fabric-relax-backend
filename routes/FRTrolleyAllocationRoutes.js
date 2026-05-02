// src/routes/stFacilityRouter.js
const FRTrolleyAllocationController = require('../controllers/FRTrolleyAllocationController');
const BaseRouter = require('./BaseRouter');

const FRTrolleyAllocationRouter = new BaseRouter(FRTrolleyAllocationController);

module.exports = FRTrolleyAllocationRouter.getRouter();