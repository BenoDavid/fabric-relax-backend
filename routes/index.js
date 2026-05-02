
const express = require('express');
const router = express.Router();

const fabricRelaxRoutes = require('./FRFabricRelaxRoutes');
const FRTrolleyRoutes = require('./FRTrolleyRoutes');
const wmsfabricCollectionRoutes = require('./WMSFabricCollectionRoutes');
const trolleyAllocationRoutes = require('./FRTrolleyAllocationRoutes');
const FRIssueRoutes = require('./FRIssueRoutes');

// Use routes
router.use('/wmsfabriccollection', wmsfabricCollectionRoutes);

// // Use routes
router.use('/receive-roll', fabricRelaxRoutes);
router.use('/issue-roll', FRIssueRoutes);
router.use('/trolleys', FRTrolleyRoutes);
router.use('/trolleys-allocation', trolleyAllocationRoutes);
router.use('/allocate-location', FRTrolleyRoutes);

module.exports = router;
