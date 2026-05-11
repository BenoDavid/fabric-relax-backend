
"use strict";

const db = require("../models");
const BaseController = require("./BaseController");

const {
  FRTrolley,
  FRTrolleyRack,
  FRTrolleyAllocation,
  FRPallet,
  FRPalletAllocation,
  FRFabricRelax,
} = db.sequelizeDb2.models;

class FRTrolleyAllocationController extends BaseController {
  constructor() {
    super(FRTrolleyAllocation);
  }

  async create(req, res) {
    const {
      type,
      rollId,
      trolleyCode,
      rackNo,
      allocatedBy,
      buyerName,
      palletCode,
    } = req.body;

    try {
      await db.sequelizeDb2.transaction(async (transaction) => {

        const roll = await FRFabricRelax.findByPk(rollId, { transaction });
        if (!roll) throw new Error("Roll not found");

        if (type === "TROLLEY") {
          if (!trolleyCode) throw new Error("Trolley required");
          if (!rackNo) throw new Error("Rack required");

          const trolley = await FRTrolley.findOne({
            where: { trolleyId: trolleyCode },
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

          if (!trolley) throw new Error("Trolley not found");

          const rack = await FRTrolleyRack.findOne({
            where: {
              trolleyId: trolley.id,
              rackNo,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

          if (!rack) throw new Error(`Rack ${rackNo} not found`);
          if (rack.isOccupied) throw new Error("Rack already occupied");

          if (!trolley.buyerName) {
            trolley.buyerName = roll.buyerName;
            await trolley.save({ transaction });
          } else if (trolley.buyerName !== roll.buyerName) {
            throw new Error("Buyer mismatch – trolley locked");
          }

          // ✅ REMOVE FROM OLD TROLLEY (Trolley → Trolley move)
          const existingTrolley = await FRTrolleyAllocation.findOne({
            where: { rollId },
            transaction,
          });

          if (existingTrolley) {
            // free old rack
            await FRTrolleyRack.update(
              { isOccupied: false },
              {
                where: {
                  trolleyId: existingTrolley.trolleyId,
                  rackNo: existingTrolley.rackNo,
                },
                transaction,
              }
            );

            await existingTrolley.destroy({ transaction });
          }

          // ✅ REMOVE FROM PALLET (Pallet → Trolley)
          await FRPalletAllocation.destroy({
            where: { rollId },
            transaction,
          });

          // ✅ CREATE NEW ALLOCATION
          await FRTrolleyAllocation.create({
            trolleyId: trolley.id,
            rackNo,
            rollId,
            buyerName,
            allocatedBy,
            allocatedAt: new Date(),
          }, { transaction });

          // ✅ UPDATE RACK
          rack.isOccupied = true;
          await rack.save({ transaction });

          // ✅ UPDATE TROLLEY STATUS
          const count = await FRTrolleyRack.count({
            where: { trolleyId: trolley.id, isOccupied: true },
            transaction,
          });

          trolley.status =
            count >= trolley.capacity ? "FULL" : "PARTIAL";

          await trolley.save({ transaction });

          // ✅ UPDATE ROLL
          roll.status = "trolley_allocated";
          roll.trolleyCode = trolleyCode;
          await roll.save({ transaction });
        }


        else if (type === "PALLET") {
          if (!palletCode) throw new Error("Pallet required");

          const pallet = await FRPallet.findOne({
            where: { palletCode },
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

          if (!pallet) throw new Error("Pallet not found");

          // ✅ REMOVE FROM TROLLEY (Trolley → Pallet)
          const existingTrolley = await FRTrolleyAllocation.findOne({
            where: { rollId },
            transaction,
          });

          if (existingTrolley) {

            await FRTrolleyRack.update(
              { isOccupied: false },
              {
                where: {
                  trolleyId: existingTrolley.trolleyId,
                  rackNo: existingTrolley.rackNo,
                },
                transaction,
              }
            );

            await existingTrolley.destroy({ transaction });
          }

          // ✅ REMOVE FROM OLD PALLET (Pallet → Pallet move)
          await FRPalletAllocation.destroy({
            where: { rollId },
            transaction,
          });

          // ✅ CREATE NEW PALLET ALLOCATION
          await FRPalletAllocation.create({
            palletId: pallet.id,
            rollId,
            buyerName: roll.buyerName,
            allocatedBy,
            allocatedAt: new Date(),
          }, { transaction });

          // ✅ UPDATE PALLET STATUS
          const count = await FRPalletAllocation.count({
            where: { palletId: pallet.id },
            transaction,
          });

          pallet.status =
            count >= pallet.maxCapacity ? "FULL" : "PARTIAL";

          await pallet.save({ transaction });

          // ✅ UPDATE ROLL
          roll.status = "pallet_allocated";
          roll.trolleyCode = palletCode;
          await roll.save({ transaction });
        }

        else {
          throw new Error("Invalid allocation type");
        }

      });

      return res.json({
        success: true,
        message: `${type} allocation successful`,
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new FRTrolleyAllocationController();
