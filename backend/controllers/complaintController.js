const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Public
const createComplaint = async (req, res) => {
    try {
        const newComplaint = await Complaint.create(req.body);
        res.status(201).json(newComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a complaint
// @route   PUT /api/complaints/:id
// @access  Public
const updateComplaint = async (req, res) => {
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedComplaint) return res.status(404).json({ message: 'Complaint not found' });
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getComplaints,
    createComplaint,
    updateComplaint
};
