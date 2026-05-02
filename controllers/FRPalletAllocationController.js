'use strict';
const db = require('../models');
const BaseController = require('./BaseController');
const { FRPalletAllocation } = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FRPalletAllocationController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(FRPalletAllocation);
  }


}

module.exports = new FRPalletAllocationController();