'use strict';

const queue = [];
let isProcessing = false;

const { recalculateIpcDailyScore } = require('../services/ipcRecalculate.service');

async function processQueue() {
    if (isProcessing) return;
    isProcessing = true;

    while (queue.length > 0) {
        const job = queue.shift();
        try {
            await recalculateIpcDailyScore(job.fromDate, job.toDate, job.operator);
        } catch (err) {
            console.error('IPC Recalculate Queue Error:', err);
        }
    }

    isProcessing = false;
}

/**
 * Enqueue a single job
 */
function addToRecalculateQueue({ fromDate, toDate, operator = null }) {
    queue.push({ fromDate, toDate, operator });
    processQueue();
}



module.exports = {
    addToRecalculateQueue
};
