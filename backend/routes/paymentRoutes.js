const express = require('express');
const router = express.Router();
const { getPayments, createOrder, verifyPayment, deletePayment } = require('../controllers/paymentController');

// All payment routes
router.route('/create-order').post(createOrder);
router.route('/verify-payment').post(verifyPayment);
router.route('/:student_id').get(getPayments);
router.route('/:id').delete(deletePayment);

module.exports = router;
