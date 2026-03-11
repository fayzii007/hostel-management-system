const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
