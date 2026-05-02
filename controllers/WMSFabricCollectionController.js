'use strict';
const db = require('../models');
const BaseController = require('./BaseController');
const { WMSFabricCollection } = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class WMSFabricCollectionController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(WMSFabricCollection);
  }


}

module.exports = new WMSFabricCollectionController();