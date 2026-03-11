const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roomNumber: {
        type: String,
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
