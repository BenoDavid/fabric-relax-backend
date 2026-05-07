"use strict";
const db = require("../models");
const BaseController = require("./BaseController");
const { FREarlyIssue, FRIssue } = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FREarlyIssueController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(FREarlyIssue);
  }

  async create(req, res) {
    const { rollId } = req.body;

    try {
      await db.sequelizeDb2.transaction(async (transaction) => {
        // ✅ Create early request record
        const item = await this.model.create(req.body, { transaction });

        if (!item) {
          throw new Error("Failed to create early request");
        }

        // ✅ Update ISSUE table using correct field
        await FRIssue.update(
          { status: "request_early_approval" },
          {
            where: { rollId: rollId }, // ✅ FIXED
            transaction,
          },
        );
      });

      return res.status(200).json({
        status: 200,
        message: `${this.model.name} created successfully`,
        result: true,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        result: {},
      });
    }
  }
}

module.exports = new FREarlyIssueController();
