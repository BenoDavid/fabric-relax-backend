// src/routes/stFacilityRouter.js
const wmsfabricCollectionController = require('../controllers/WMSFabricCollectionController');
const BaseRouter = require('./BaseRouter');

const wmsfabricCollectionRouter = new BaseRouter(wmsfabricCollectionController);

module.exports = wmsfabricCollectionRouter.getRouter();