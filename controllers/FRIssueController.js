"use strict";
const db = require("../models");
const BaseController = require("./BaseController");
const { getWss } = require("../ws");
const wss = getWss();
const {
  FRIssue,
  FRFabricRelax,
  FRTrolleyAllocation,
  FRTrolleyRack,
  FRTrolley,
} = db.sequelizeDb2.models;

/**
 * Controller for handling Product Development, Compliance, and Bulk tracking.
 * Extends a BaseController for standard CRUD functionality.
 */
class FRIssueController extends BaseController {
  constructor() {
    // Pass the fabricTracking model to the BaseController constructor
    super(FRIssue);
  }

  async createBatch(req, res) {
    const { rollIds, issueTo, status, issuedOn, issuedBy, gdnNo, trolleyCode, removeTrolley } = req.body;

    try {
      await db.sequelizeDb2.transaction(async (transaction) => {
        const rolls = await FRFabricRelax.findAll({
          where: { id: rollIds },
          transaction,
        });

        if (!rolls.length) {
          throw new Error("No rolls found");
        }

        // ✅ Build issue records
        const issueData = rolls.map((roll) => ({
          rollId: roll.id,
          issueTo: issueTo,
          status: status,
          gdnNo: gdnNo, // optional
          issuedOn: issuedOn || new Date(),
          issuedBy: issuedBy,
        }));

        // ✅ Insert bulk
        await FRIssue.bulkCreate(issueData, { transaction });

           await FRTrolley.update(
                {
                  location: null,
                  currentLocation: "cutting",
                },
                {
                  where: { trolleyId: trolleyCode },
                  transaction,
                },
              );
        // ✅ Update roll table
        await FRFabricRelax.update(
          { status: "issued_to_cutting" },
          {
            where: { id: rollIds },
            transaction,
          },
        );
         if (removeTrolley) {
          const allocations = await FRTrolleyAllocation.findAll({
            where: { rollId: rollIds },
            transaction,
          });

          if (!allocations.length) {
            throw new Error("No Rolls found");
          }
            await FRFabricRelax.update(
            { trolleyCode: null },
            {
              where: { id: rollIds },
              transaction,
            },
            );
            await FRTrolleyRack.update(
                {
                  isOccupied: false,
                },
                {
                  where: {
                [db.Sequelize.Op.or]: allocations.map((a) => ({
                  trolleyId: a.trolleyId,
                  rackNo: a.rackNo,
                })),
              },
                  transaction,
                },
              );
          const trolleyIds = [...new Set(allocations.map((a) => a.trolleyId))];

          for (const trolleyId of trolleyIds) {

            const remaining = await FRTrolleyRack.count({
              where: { trolleyId, isOccupied: true },
              transaction,
            });

            if (remaining === 0) {
              await FRTrolley.update(
                {
                  buyerName: null,
                  location: null,
                  status: "EMPTY",
                  currentLocation: "relaxation",
                },
                {
                  where: { id: trolleyId },
                  transaction,
                },
              );
            }
          }

      }
      });
       
     

      if (wss) {
        wss.broadcast({
          event: "MovedToCuttingRoll",
          data: {
            addRoll:rolls.length
          },
        });
      }
      return res.json({
        success: true,
        message: "Rolls issued to cutting successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateBatch(req, res) {
    const { type, rollIds, cuttingTable, approvedBy, returnedBy } = req.body;

    if (!rollIds || rollIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No rollIds provided",
      });
    }

    try {
      await db.sequelizeDb2.transaction(async (transaction) => {
        if (type === "APPROVE") {
          const allocations = await FRTrolleyAllocation.findAll({
            where: { rollId: rollIds },
            transaction,
          });

          if (!allocations.length) {
            throw new Error("No Rolls found");
          }

          await FRFabricRelax.update(
            { status: "APPROVED", isActive: false },
            { where: { id: rollIds }, transaction },
          );

          await FRIssue.update(
            {
              issueTo: cuttingTable,
              status: "APPROVED",
              approvedBy,
              approvedOn: new Date(),
            },
            { where: { rollId: rollIds }, transaction },
          );

          await FRTrolleyRack.update(
            { isOccupied: false },
            {
              where: {
                [db.Sequelize.Op.or]: allocations.map((a) => ({
                  trolleyId: a.trolleyId,
                  rackNo: a.rackNo,
                })),
              },
              transaction,
            },
          );

          const trolleyIds = [...new Set(allocations.map((a) => a.trolleyId))];

          for (const trolleyId of trolleyIds) {
            const remaining = await FRTrolleyRack.count({
              where: { trolleyId, isOccupied: true },
              transaction,
            });

            if (remaining === 0) {
              await FRTrolley.update(
                {
                  buyerName: null,
                  location: null,
                  status: "EMPTY",
                  currentLocation: "relaxation",
                },
                {
                  where: { id: trolleyId },
                  transaction,
                },
              );
            }

              if (wss) {
                wss.broadcast({
                  event: "CuttingApprovedRoll",
                  data: {
                    addRoll:rollIds.length
                  },
                });
              }
          }
        } else if (type === "RETURN") {
          const allocations = await FRTrolleyAllocation.findAll({
            where: { rollId: rollIds },
            transaction,
          });

          if (!allocations.length) {
            throw new Error("No Rolls found");
          }

          await FRFabricRelax.update(
            { status: "returned_to_relaxation" },
            { where: { id: rollIds }, transaction },
          );

          await FRIssue.update(
            {
              status: "RETURNED",
              returnedOn: new Date(),
              returnedBy,
            },
            { where: { rollId: rollIds }, transaction },
          );

            const trolleyIds = [...new Set(allocations.map((a) => a.trolleyId))];

          for (const trolleyId of trolleyIds) {
            const remaining = await FRTrolleyRack.count({
              where: { trolleyId, isOccupied: true },
              transaction,
            });

            if (remaining === 0) {
              await FRTrolley.update(
                {
                  currentLocation: "returned_to_relaxation",
                },
                {
                  where: { id: trolleyId },
                  transaction,
                },
              );
            }
          }
            if (wss) {
                wss.broadcast({
                  event: "CuttingRejectedRoll",
                  data: {
                    addRoll:rollIds.length
                  },
                });
              }
          
        } else if (type === "ROLL_APPROVE") {
          await FRFabricRelax.update(
            { status: "APPROVED", isActive: false },
            { where: { id: rollIds }, transaction },
          );

          await FRIssue.update(
            {
              issueTo: cuttingTable,
              status: "APPROVED",
              approvedBy,
              approvedOn: new Date(),
            },
            { where: { rollId: rollIds }, transaction },
          );
        } else if (type === "ROLL_RETURN") {
          await FRFabricRelax.update(
            { status: "returned_to_relaxation" },
            { where: { id: rollIds }, transaction },
          );

          await FRIssue.update(
            {
              status: "RETURNED",
              returnedOn: new Date(),
              returnedBy,
            },
            { where: { rollId: rollIds }, transaction },
          );          
        }else if (type === "PARTIAL_APPROVE") {
          const allocations = await FRTrolleyAllocation.findAll({
            where: { rollId: rollIds },
            transaction,
          });
          await FRFabricRelax.update(
            { status: "APPROVED", isActive: false },
            { where: { id: rollIds }, transaction },
          );

          await FRIssue.update(
            {
              issueTo: cuttingTable,
              status: "APPROVED",
              approvedBy,
              approvedOn: new Date(),
            },
            { where: { rollId: rollIds }, transaction },
          );
              await FRTrolleyRack.update(
            { isOccupied: false },
            {
              where: {
                [db.Sequelize.Op.or]: allocations.map((a) => ({
                  trolleyId: a.trolleyId,
                  rackNo: a.rackNo,
                })),
              },
              transaction,
            },
          );

          const trolleyIds = [...new Set(allocations.map((a) => a.trolleyId))];

          for (const trolleyId of trolleyIds) {
            const remaining = await FRTrolleyRack.count({
              where: { trolleyId, isOccupied: true },
              transaction,
            });

            if (remaining === 0) {
              await FRTrolley.update(
                {
                  buyerName: null,
                  location: null,
                  status: "EMPTY",
                  currentLocation: "relaxation",
                },
                {
                  where: { id: trolleyId },
                  transaction,
                },
              );
            }

              if (wss) {
                wss.broadcast({
                  event: "CuttingApprovedRoll",
                  data: {
                    addRoll:rollIds.length
                  },
                });
              }
          }
        } else if (type === "PARTIAL_RETURN") {
          const allocations = await FRTrolleyAllocation.findAll({
          where: { rollId: rollIds },
          transaction,
          });
          await FRFabricRelax.update(
            { status: "returned_to_relaxation",trolleyCode: null },
            { where: { id: rollIds }, transaction },
          );

          await FRIssue.update(
            {
              status: "RETURNED",
              returnedOn: new Date(),
              returnedBy,
            },
            { where: { rollId: rollIds }, transaction },
          );  
                await FRTrolleyRack.update(
                {
                  isOccupied: false,
                },
                {
                  where: {
                [db.Sequelize.Op.or]: allocations.map((a) => ({
                  trolleyId: a.trolleyId,
                  rackNo: a.rackNo,
                })),
              },
                  transaction,
                },
              );
            const trolleyIds = [...new Set(allocations.map((a) => a.trolleyId))];

          for (const trolleyId of trolleyIds) {
            const remaining = await FRTrolleyRack.count({
              where: { trolleyId, isOccupied: true },
              transaction,
            });

            if (remaining === 0) {
              await FRTrolley.update(
                {
                  currentLocation: "returned_to_relaxation",
                },
                {
                  where: { id: trolleyId },
                  transaction,
                },
              );
            }
          }        
        }
      });

      return res.json({
        success: true,
        message: `${type} operation successful`,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new FRIssueController();
