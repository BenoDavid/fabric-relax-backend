'use strict';

/**
 * Order Quantity Configuration
 * Determines target SMV and productivity parameters
 * based on total output quantity
 */
const ORDER_QTY_CONFIG = Object.freeze([
    {
        start: 0,
        end: 25,
        category: '1',
        targetedSMV: 50,
        idealSMV: '8.33%',
        noOfOperators: 5,
        exampleSMVperGmt: 10,
        pcsPerHeadPerDayTarget: 5,
        totalSMVTargetedPerDay: 250,
        totalPCsPerDay: 25,
    },
    {
        start: 26,
        end: 500,
        category: 'SMS',
        targetedSMV: 100,
        idealSMV: '16.67%',
        noOfOperators: 10,
        exampleSMVperGmt: 10,
        pcsPerHeadPerDayTarget: 10,
        totalSMVTargetedPerDay: 1000,
        totalPCsPerDay: 100,
    },
    {
        start: 501,
        end: 2000,
        category: 'TEST',
        targetedSMV: 180,
        idealSMV: '30.00%',
        noOfOperators: 10,
        exampleSMVperGmt: 18,
    },
    {
        start: 2001,
        end: 5000,
        category: 'BULK',
        targetedSMV: 250,
        idealSMV: '41.60%',
        noOfOperators: 10,
        exampleSMVperGmt: 25,
    },
    {
        start: 5001,
        category: 'BULK-2',
        targetedSMV: 300,
        idealSMV: '50.00%',
        noOfOperators: 10,
        exampleSMVperGmt: 30,
    },
]);

module.exports = {
    ORDER_QTY_CONFIG,
};
