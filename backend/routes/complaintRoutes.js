const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaint, deleteComplaint } = require('../controllers/complaintController');

router.route('/').get(getComplaints).post(createComplaint);
router.route('/:id').put(updateComplaint).delete(deleteComplaint);

module.exports = router;
