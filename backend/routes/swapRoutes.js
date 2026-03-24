const express = require('express');
const router = express.Router();
const { 
    toggleSwapStatus, getSwapCandidates, sendSwapRequest, 
    handleSwapRequest, getStudentRequests 
} = require('../controllers/swapController');

router.post('/toggle-status', toggleSwapStatus);
router.get('/candidates', getSwapCandidates);
router.post('/request', sendSwapRequest);
router.post('/handle', handleSwapRequest);
router.get('/requests/:studentId', getStudentRequests);

module.exports = router;
