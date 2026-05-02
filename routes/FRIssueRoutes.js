// src/routes/stFacilityRouter.js
const FRIssueController = require('../controllers/FRIssueController');
const BaseRouter = require('./BaseRouter');

const FRIssueRouter = new BaseRouter(FRIssueController);

module.exports = FRIssueRouter.getRouter();
