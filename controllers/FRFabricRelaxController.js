'use strict';
const { TIME } = require('sequelize');
const db = require('../models');
const BaseController = require('./BaseController');
const { FRFabricRelax ,WMSFabricCollection} = db.sequelizeDb2.models;
const { Sequelize } = require('sequelize');

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FRFabricRelaxController extends BaseController {
  constructor() {
    // Pass the FRFabricRelax model to the BaseController constructor
    super(FRFabricRelax);
  }
 async create(req, res) {
    try {

      const fab = await WMSFabricCollection.findOne({
        where: {
             shadeLot: req.body.shadeLot,
             ocNo: req.body.ocNo,
             invoiceNo: req.body.invoiceNo,
        }
      });

      if (!fab) {
        return res.status(404).json({
          status: 404,
          message: 'Fabric not found',
          result: null
        });
      }
      const roll = await FRFabricRelax.findOne({
        where: {
          rollId: fab?.id,
        }
      });

      if (roll) {
        return res.status(404).json({
          status: 404,
          message: 'Roll already exists in relaxation process',
          result: null
        });
      }

      const item = await this.model.create({
        rollId: fab?.id,
        machineId: req.body.machineId,
        machineStart: Date.now(),
        facility: req.body.facility,
        fabricContent: req.body.fabricContent,
        status: 'Relaxation Processing',
        relaxingHours: req.body.relaxingHour,
        buyerName: req.body.buyerName,
        uom: req.body.uom,
        machineLoadBy: req.body.machineLoadBy
      });
      res.status(200).json({
        status: 200,
        message: `${this.model.name} created successfully`,
        result: {
          createdItem: item,
          fabricDetails: fab
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        result: {}
      });
    }
  }
 async getAll(req, res) {
    try {
      // Extract query parameters for pagination, filtering, and sorting
      const { fromDate, toDate, page = 1, limit = 10, search,
        searchField, sortBy = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;

      // Set up pagination
      const offset = (page - 1) * limit;
      const paginationOptions = { offset: parseInt(offset), limit: parseInt(limit) };

      // Set up sorting
      const sortOptions = [[sortBy, sortOrder.toUpperCase()]];

      // Set up filtering
      const filterOptions = {};
      for (const key in filters) {
        filterOptions[key] = filters[key];
      }

      // 🔍 Dynamic field search
      if (search && searchField) {
        filterOptions[searchField] = {
          [Sequelize.Op.like]: `%${search}%`
        };
      }

      // 🔍 Global search across all model fields
      else if (search) {
        const searchConditions = [];

        for (const attribute of Object.keys(this.model.rawAttributes)) {
          searchConditions.push({
            [attribute]: { [Sequelize.Op.like]: `%${search}%` }
          });
        }

        filterOptions[Sequelize.Op.or] = searchConditions;
      }

      if (fromDate && toDate) {
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        // Adjust endDate to include the entire day
        endDate.setHours(23, 59, 59, 999);

        filterOptions.createdAt = {
          [Sequelize.Op.between]: [startDate, endDate],
        };
      }
      // Combine all options and fetch data
      const items = await this.model.findAndCountAll({
        where: filterOptions,
         include: [{
              model: this.model.associations.fabric.target,
              as: 'fabric',
            }]
        // order: sortOptions,
        // ...paginationOptions
      });

      // Respond with paginated data and metadata
      res.status(200).json({
        status: 200,
        message: `${this.model.name}s fetched successfully`,
        result: items.rows,
        pagination: {
          totalItems: items.count,
          totalPages: Math.ceil(items.count / limit),
          currentPage: parseInt(page),
          pageSize: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        result: [],
      });
    }
  }
}

module.exports = new FRFabricRelaxController();