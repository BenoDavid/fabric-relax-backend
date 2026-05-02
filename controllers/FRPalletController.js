'use strict';
const db = require('../models');
const BaseController = require('./BaseController');
const { FRPallet } = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FRPalletController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(FRPallet);
  }


}

module.exports = new FRPalletController();