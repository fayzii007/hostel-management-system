const express = require('express');
const router = express.Router();
const { 
    getAllPayments, getPaymentsByStudent, createOrder, 
    verifyPayment, deletePayment, recordManualPayment 
} = require('../controllers/paymentController');

// All payment routes
router.route('/').get(getAllPayments);
router.route('/manual').post(recordManualPayment);
router.route('/create-order').post(createOrder);
router.route('/verify-payment').post(verifyPayment);
router.route('/student/:student_id').get(getPaymentsByStudent);
router.route('/:id').delete(deletePayment);

module.exports = router;
