const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Public
const createRoom = async (req, res) => {
    try {
        const newRoom = await Room.create(req.body);
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Public
const updateRoom = async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });
        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getRooms,
    createRoom,
    updateRoom
};
