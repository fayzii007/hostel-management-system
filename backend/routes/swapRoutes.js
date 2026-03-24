const express = require('express');
const router = express.Router();
const { 
    toggleSwapStatus, getSwapCandidates, sendSwapRequest, 
    handleSwapRequest, getStudentRequests, getSwapSuggestions,
    getAllSwapsAdmin, adminHandleSwap
} = require('../controllers/swapController');

router.post('/toggle-status', toggleSwapStatus);
router.get('/candidates', getSwapCandidates);
router.post('/request', sendSwapRequest);
router.post('/handle', handleSwapRequest);
router.get('/requests/:studentId', getStudentRequests);
router.get('/suggestions/:studentId', getSwapSuggestions);

// Admin Routes
router.get('/admin/all', getAllSwapsAdmin);
router.post('/admin/handle', adminHandleSwap);

module.exports = router;
