const { STIPCLeverageConfig } = require('../models').sequelizeDb2.models;

async function getLeverageFromDB(fabricType, sampleType, smvType, planType) {
    const row = await STIPCLeverageConfig.findOne({
        where: {
            fabricType,
            sampleType,
            smvType,
            planType,
            isActive: true
        }
    });

    return row ? row.leverage : 0;
}

module.exports = { getLeverageFromDB };
