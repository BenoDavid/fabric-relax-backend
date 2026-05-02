'use strict';
const db = require('../models');
const BaseController = require('./BaseController');
const { FRMachine } = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FRMachineController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(FRMachine);
  }


}

module.exports = new FRMachineController();