const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Public
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Public
const createPayment = async (req, res) => {
    try {
        const newPayment = await Payment.create(req.body);
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPayments,
    createPayment
};
