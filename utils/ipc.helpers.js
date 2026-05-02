'use strict';

const { SAMPLE_TYPE_MAP } = require('../constants/sampletype.constant');
const { ORDER_QTY_CONFIG } = require('../constants/order-qty-config.constant');
const {
    FAB_TYPES,
    SAMPLE_TYPES,
    SMV_TYPES,
    PLAN_TYPES,
    LEVERAGE_MATRIX,
} = require('../constants/leverage.constant');

/**
 * Sample code resolver
 */
function getSampleCode(sampleType) {
    return SAMPLE_TYPE_MAP[sampleType] ?? { code: 0, category: 'Normal' };
}

/**
 * Leverage calculator
 */
function getLeverage(fab, sample, smv, plan) {
    if (!FAB_TYPES.includes(fab)) fab = 'Normal';
    if (!SAMPLE_TYPES.includes(sample)) sample = 'Normal';
    if (!SMV_TYPES.includes(smv)) smv = 'Normal';
    if (!PLAN_TYPES.includes(plan)) plan = 'Planned';

    const key = `${fab}_${sample}_${smv}_${plan}`;
    return LEVERAGE_MATRIX[key] ?? 0;
}

/**
 * Order qty config resolver
 */
function getOrderRangeConfig(qty) {
    return (
        ORDER_QTY_CONFIG.find(row => {
            if (row.end !== undefined) {
                return qty >= row.start && qty <= row.end;
            }
            return qty >= row.start;
        }) || null
    );
}

module.exports = {
    getSampleCode,
    getLeverage,
    getOrderRangeConfig,
};
