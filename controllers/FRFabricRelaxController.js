"use strict";
const { TIME, where } = require("sequelize");
const db = require("../models");
const BaseController = require("./BaseController");
const { FRFabricRelax, WMSFabricCollection, FRTrolleyAllocation, FRTrolleyRack, FRTrolley } = db.sequelizeDb2.models;
const { Sequelize } = require("sequelize");
const { getWss } = require("../ws");
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
        },
      });

      if (!fab) {
        return res.status(404).json({
          status: 404,
          message: "Fabric not found",
          result: null,
        });
      }
      const roll = await FRFabricRelax.findOne({
        where: {
          rollId: fab?.id,
          isActive: true,
        },
      });

      if (roll) {
        return res.status(404).json({
          status: 404,
          message: "Roll already exists in relaxation process",
          result: null,
        });
      }

      const item = await this.model.create({
        rollId: fab?.id,
        machineId: req.body.machineId,
        machineStart: Date.now(),
        facility: req.body.facility,
        fabricContent: req.body.fabricContent,
        status: "relaxation_processing",
        relaxingHours: req.body.relaxingHour,
        buyerName: req.body.buyerName,
        uom: req.body.uom,
        machineLoadBy: req.body.machineLoadBy,
      });

      const wss = getWss();
      if (wss) {
        wss.broadcast({
          event: "loadRoll",
          data: {
            addRoll: 1,
          },
        });
      }

      res.status(200).json({
        status: 200,
        message: `${this.model.name} created successfully`,
        result: {
          createdItem: item,
          fabricDetails: fab,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        result: {},
      });
    }
  }
  async getAll(req, res) {
    try {
      // Extract query parameters for pagination, filtering, and sorting
      const {
        fromDate,
        toDate,
        page = 1,
        limit = 10,
        search,
        searchField,
        sortBy = "createdAt",
        sortOrder = "DESC",
        ...filters
      } = req.query;

      // Set up pagination
      const offset = (page - 1) * limit;
      const paginationOptions = {
        offset: parseInt(offset),
        limit: parseInt(limit),
      };

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
          [Sequelize.Op.like]: `%${search}%`,
        };
      }

      // 🔍 Global search across all model fields
      else if (search) {
        const searchConditions = [];

        for (const attribute of Object.keys(this.model.rawAttributes)) {
          searchConditions.push({
            [attribute]: { [Sequelize.Op.like]: `%${search}%` },
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
      if(rollId) {
        filterOptions.rollId = rollId;
      }
      const fabricWhere = {};
      if (filterOptions.shadeLot) fabricWhere.shadeLot = filterOptions.shadeLot;
      if (filterOptions.ocNo) fabricWhere.ocNo = filterOptions.ocNo;
      if (filterOptions.poNo) fabricWhere.poNo = filterOptions.poNo;
      if (filterOptions.fabricRef)
        fabricWhere.fabricRef = filterOptions.fabricRef;

      // Combine all options and fetch data
      const whereOptions = {};
      if (filterOptions.createdAt)
        whereOptions.createdAt = filterOptions.createdAt;
  
      if (filterOptions.status) {
        if (typeof filterOptions.status === "string" && filterOptions.status.includes(",")) {
          whereOptions.status = {
            [Sequelize.Op.in]: filterOptions.status.split(","),
          };
        } else {
          whereOptions.status = filterOptions.status;
          if (filterOptions.status === "over_relaxed") {

            // ✅ ONLY calculated condition
            whereOptions.status = {
              [Sequelize.Op.in]: [
                "relaxation_processing",
                "trolley_allocated",
                "pallet_allocated"
              ]
            };

            whereOptions.machineEnd = {
              [Sequelize.Op.ne]: null
            };

            whereOptions.relaxingHours = {
              [Sequelize.Op.ne]: null
            };


            whereOptions[Sequelize.Op.and] = Sequelize.where(
              Sequelize.literal("DATEADD(HOUR, relaxingHours, machineEnd)"),
              "<=",
              Sequelize.literal("GETDATE()")
            );
            

          }else if (filterOptions.status === "early_issued") {
             whereOptions.status = {
              [Sequelize.Op.in]: [
                "trolley_allocated",
                "issued_to_cutting",
                "Approved",
                "returned_to_relaxation"
              ]
            };
          }
          
          else if (filterOptions.status === "issued_to_cutting") {
            if (filterOptions.trolleyCode) {
              whereOptions.trolleyCode = filterOptions.trolleyCode;
            } else {
              whereOptions.trolleyCode = {
                [Sequelize.Op.is]: null,
              };
            }
              if (filterOptions.rollId) {
              whereOptions.rollId = filterOptions.rollId;
            } else {
              whereOptions.rollId = {
                [Sequelize.Op.is]: null,
              };
            }
          }else if (filterOptions.status === "returned_to_relaxation") { 
             if (filterOptions.trolleyCode) {
              whereOptions.trolleyCode = filterOptions.trolleyCode;
            } else {
              whereOptions.trolleyCode = {
                [Sequelize.Op.is]: null,
              };
            }
            if (filterOptions.rollId) {
              whereOptions.rollId = filterOptions.rollId;
            } else {
              whereOptions.rollId = {
                [Sequelize.Op.is]: null,
              };
            }
          }
          else{
            whereOptions.status = filterOptions.status;
          }
        }
      }

      if (filterOptions.trolleyCode && filterOptions.status !== "issued_to_cutting")
        whereOptions.trolleyCode = filterOptions.trolleyCode;

      // for (const key in filterOptions) {
      //   whereOptions[key] = filterOptions[key];
      // }
      const items = await this.model.findAndCountAll({
        where: whereOptions,
        include: [
          {
            model: this.model.associations.fabric.target,
            as: "fabric",
            ...(Object.keys(fabricWhere).length && { where: fabricWhere }),
          },
          {
            model: this.model.associations.issuefabric.target,
            as: "issuefabric",
          },
          {
            model: this.model.associations.trolleyAllocation.target,
            as: "trolleyAllocation",
          },
          {
            model: this.model.associations.earlyIssue.target,
            as: "earlyIssue", // ✅ must match alias
            attributes: ["rollId", "status", "requestedOn", "approvedOn"],
            
            required: filterOptions.status == "early_issued",

            where:
              filterOptions.status == "early_issued"
                ? { status: "APPROVED" }
                : undefined,

          },
          
        ],
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
          pageSize: parseInt(limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        result: [],
      });
    }
  }
  async getAllByCustomKey(req, res) {
    try {
      const filters = req.body || {};

      const items = await this.model.findAll({
        where: filters,
      });

      const now = new Date().getTime();

      // ✅ Helper function
      const isCompleted = (row) => {
        if (!row.machineEnd || !row.relaxingHours) return false;

        const totalTime =
          new Date(row.machineEnd).getTime() +
          row.relaxingHours * 60 * 60 * 1000;

        return totalTime <= now;
      };

      // ✅ ✅ COUNTS
      const counts = {
        loadRoll: items.filter((r) => r.machineEnd == null).length,

        loadedRoll: items.filter(
          (r) => r.machineEnd != null && r.status === "relaxation_started",
        ).length,

        trolleyAllocated: items.filter(
          (r) =>
            r.machineEnd != null &&
            (r.status === "trolley_allocated" ||
              r.status === "returned_to_relaxation"),
        ).length,

        relaxationCompleted: items.filter((r) => isCompleted(r)).length,

        overRelaxed: items.filter(
          (r) => isCompleted(r) && r.status === "trolley_allocated",
        ).length,

        issuedToCutting: items.filter((r) => r.status === "issued_to_cutting")
          .length,

        approved: items.filter((r) => r.status === "APPROVED").length,

        returned: items.filter((r) => r.status === "returned_to_relaxation")
          .length,
        issuedToCuttingWithoutTrolley: items.filter((r) =>
        r.status?.trim().toLowerCase() === "issued_to_cutting" &&
        !r.trolleyCode
        
      ),
      };

      return res.status(200).json({
        status: 200,
        message: `${this.model.name} fetched successfully`,
        result: counts,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        result: {},
      });
    }
  }
  async update(req, res) {
    try {
      const [updated] = await this.model.update(req.body, {
        where: { id: req.params.id },
      });
      if (updated) {
        const item = await this.model.findByPk(req.params.id);
        res.status(200).json({
          status: 200,
          message: `${this.model.name}s updated successfully`,
          result: item,
        });
        const wss = getWss();
        if (wss) {
          wss.broadcast({
            event: "loadedRoll",
            data: {
              addRoll: 1,
            },
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
        result: {},
      });
    }
  }
async updateBatch(req, res) {
  try {

    const { ids, data } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No IDs provided",
        result: []
      });
    }

    await db.sequelizeDb2.transaction(async (transaction) => {

      // ✅ 1. Update main table
      const [updated] = await this.model.update(data, {
        where: {
          id: {
            [db.Sequelize.Op.in]: ids
          }
        },
        transaction
      });

      if (!updated) {
        throw new Error("No records found to update");
      }

      // ✅ 2. Get updated items
      const updatedItems = await this.model.findAll({
        where: {
          id: {
            [db.Sequelize.Op.in]: ids
          }
        },
        transaction
      });

      // ✅ 3. Get trolley allocations
      const allocations = await FRTrolleyAllocation.findAll({
        where: {
          rollId: {
            [db.Sequelize.Op.in]: ids   
          }
        },
        transaction
      });

      // ✅ 4. Free racks
      if (allocations.length > 0) {

        await FRTrolleyRack.update(
          { isOccupied: false },
          {
            where: {
              [db.Sequelize.Op.or]: allocations.map((a) => ({
                trolleyId: a.trolleyId,
                rackNo: a.rackNo,
              })),
            },
            transaction
          }
        );

        // ✅ 5. Delete allocations (IMPORTANT)
        // await FRTrolleyAllocation.destroy({
        //   where: {
        //     rollId: {
        //       [db.Sequelize.Op.in]: ids
        //     }
        //   },
        //   transaction
        // });

        // ✅ 6. Reset trolley if empty
        const trolleyIds = [...new Set(allocations.map(a => a.trolleyId))];

        for (const trolleyId of trolleyIds) {

          const remaining = await FRTrolleyRack.count({
            where: {
              trolleyId,
              isOccupied: true
            },
            transaction
          });


          if (remaining === 0) {
            await FRTrolley.update(
              {
                buyerName: null,
                location: null,
                status: "EMPTY",
                currentLocation: 'relaxation'
              },
              {
                where: { id: trolleyId },
                transaction
              }
            );
          }
        }
      }

      // ✅ 7. WebSocket broadcast
      const wss = getWss();
      if (wss) {
        wss.broadcast({
          event: "CuttingRejectedRoll",
          data: {
            addRoll: ids.length,
          },
        });
      }

      // ✅ 8. Response
      return res.status(200).json({
        status: 200,
        message: `${this.model.name}s updated successfully`,
        result: updatedItems
      });

    });

  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: error.message,
      result: []
    });

  }
}

}

module.exports = new FRFabricRelaxController();
