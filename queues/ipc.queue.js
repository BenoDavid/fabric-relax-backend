const queue = [];
let isProcessing = false;

const { processIpcCalculation } = require('../services/ipcCalculation.service');

async function processQueue() {
    if (isProcessing) return;
    isProcessing = true;

    while (queue.length > 0) {
        const job = queue.shift();
        try {
            await processIpcCalculation(job);
        } catch (err) {
            console.error('IPC Queue Error:', err);
        }
    }

    isProcessing = false;
}

function addToQueue(data) {
    queue.push(data);
    processQueue();
}

module.exports = { addToQueue };
