
const express = require('express');
const router = express.Router();

const fabricRelaxRoutes = require('./FRFabricRelaxRoutes');
const FRTrolleyRoutes = require('./FRTrolleyRoutes');
const wmsfabricCollectionRoutes = require('./WMSFabricCollectionRoutes');
const trolleyAllocationRoutes = require('./FRTrolleyAllocationRoutes');
const FRIssueRoutes = require('./FRIssueRoutes');
const FREarlyIssueRoutes = require('./FREarlyIssueRoutes');
const FRPalletRoutes = require('./FRPalletRoutes');
const FRPalletAllocationRoutes = require('./FRPalletAllocationRoutes');

// Use routes
router.use('/wmsfabriccollection', wmsfabricCollectionRoutes);

// // Use routes
router.use('/receive-roll', fabricRelaxRoutes);
router.use('/issue-roll', FRIssueRoutes);
router.use('/trolleys', FRTrolleyRoutes);
router.use('/pallets', FRPalletRoutes);
router.use('/pallets-allocation', FRPalletAllocationRoutes);
router.use('/trolleys-allocation', trolleyAllocationRoutes);
router.use('/allocate-location', FRTrolleyRoutes);
router.use('/early-issue', FREarlyIssueRoutes);

module.exports = router;
