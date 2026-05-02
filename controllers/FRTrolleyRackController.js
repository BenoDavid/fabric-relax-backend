'use strict';
const db = require('../models');
const BaseController = require('./BaseController');
const { FRTrolleyRack } = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FRTrolleyRackController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(FRTrolleyRack);
  }


}

module.exports = new FRTrolleyRackController();