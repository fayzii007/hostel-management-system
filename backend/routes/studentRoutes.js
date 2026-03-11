const express = require('express');
const router = express.Router();
const { getStudents, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');

router.route('/').get(getStudents).post(createStudent);
router.route('/:id').put(updateStudent).delete(deleteStudent);

module.exports = router;
