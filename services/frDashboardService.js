"use strict";

const db = require("../models");
const { FRFabricRelax } = db.sequelizeDb2.models;

async function getDashboardSnapshot(filters = {}) {
  const rows = await FRFabricRelax.findAll({
    where: filters,
    attributes: ["machineEnd", "relaxingHours", "status", "trolleyCode"],
  });
  const now = Date.now();
  let nextUpdateAt = null;

  const isCompleted = (row) => {
    if (!row.machineEnd || !row.relaxingHours) return false;

    const deadline =
      new Date(row.machineEnd).getTime() +
      Number(row.relaxingHours) * 60 * 60 * 1000;

    if (Number.isFinite(deadline) && deadline > now) {
      nextUpdateAt =
        nextUpdateAt === null ? deadline : Math.min(nextUpdateAt, deadline);
    }

    return deadline <= now;
  };

  const counts = {
    loadRoll: rows.filter(
      (row) => row.machineEnd == null && row.status === "relaxation_processing",
    ).length,
    loadedRoll: rows.filter(
      (row) => row.machineEnd != null && row.status === "relaxation_started",
    ).length,
    trolleyAllocated: rows.filter(
      (row) => row.machineEnd != null && row.status === "trolley_allocated",
    ).length,
    relaxationCompleted: rows.filter((row) => isCompleted(row)).length,
    overRelaxed: rows.filter(
      (row) => isCompleted(row) && row.status === "trolley_allocated",
    ).length,
    issuedToCutting: rows.filter(
      (row) => row.status === "issued_to_cutting",
    ).length,
    approved: rows.filter((row) => row.status === "APPROVED").length,
    returned: rows.filter(
      (row) => row.status === "returned_to_relaxation",
    ).length,
    issuedToCuttingWithoutTrolley: rows.filter(
      (row) =>
        row.status?.trim().toLowerCase() === "issued_to_cutting" &&
        (row.trolleyCode === null || row.trolleyCode === undefined),
    ).length,
  };

  return { counts, nextUpdateAt };
}

module.exports = { getDashboardSnapshot };
