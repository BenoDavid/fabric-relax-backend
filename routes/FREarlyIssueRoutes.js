// src/routes/stFacilityRouter.js
const FREarlyIssueController = require('../controllers/FREarlyIssueController');
const BaseRouter = require('./BaseRouter');

const FREarlyIssueRouter = new BaseRouter(FREarlyIssueController);

module.exports = FREarlyIssueRouter.getRouter();