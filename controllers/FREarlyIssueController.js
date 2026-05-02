'use strict';
const db = require('../models');
const BaseController = require('./BaseController');
const { FREarlyIssue } = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FREarlyIssueController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(FREarlyIssue);
  }


}

module.exports = new FREarlyIssueController();