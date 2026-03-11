const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaint } = require('../controllers/complaintController');

router.route('/').get(getComplaints).post(createComplaint);
router.route('/:id').put(updateComplaint);

module.exports = router;
