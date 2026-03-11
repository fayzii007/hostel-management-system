const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
        default: 2,
    },
    occupancy: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
