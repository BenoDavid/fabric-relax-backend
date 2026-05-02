'use strict';

/**
 * Allowed domain values (runtime-safe)
 */
const FAB_TYPES = ['Normal', 'Special'];
const SAMPLE_TYPES = ['Normal', 'Critical'];
const SMV_TYPES = ['Normal', 'High'];
const PLAN_TYPES = ['Planned', 'UnPlanned'];

/**
 * Leverage Matrix
 * Key format:
 * FabType_SampleType_SmvType_PlanType
 */
const LEVERAGE_MATRIX = Object.freeze({
    Normal_Normal_Normal_Planned: 0,
    Special_Normal_Normal_Planned: 5,
    Normal_Critical_Normal_Planned: 10,
    Normal_Critical_Normal_UnPlanned: 20,
    Normal_Normal_High_Planned: 10,
    Normal_Normal_Normal_UnPlanned: 10,

    Special_Critical_High_UnPlanned: 35,
    Special_Critical_Normal_Planned: 15,
    Special_Normal_High_Planned: 15,
    Special_Normal_Normal_UnPlanned: 15,

    Normal_Critical_High_Planned: 20,
    Normal_Critical_High_UnPlanned: 30,
    Normal_Normal_High_UnPlanned: 20,
    Special_Critical_High_Planned: 25,
    Special_Critical_Normal_UnPlanned: 25,
});

module.exports = {
    FAB_TYPES,
    SAMPLE_TYPES,
    SMV_TYPES,
    PLAN_TYPES,
    LEVERAGE_MATRIX,
};
