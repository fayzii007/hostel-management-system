const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json({ message: 'Student removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
};
