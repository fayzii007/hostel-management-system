const express = require('express');
const router = express.Router();
const { 
    getStudents, createStudent, updateStudent, deleteStudent, 
    getRoommates, findMatch, acceptMatch 
} = require('../controllers/studentController');

router.route('/').get(getStudents).post(createStudent);
router.route('/roommates/:roomNumber').get(getRoommates);
router.get('/find-match/:id', findMatch);
router.post('/accept-match', acceptMatch);
router.route('/:id').put(updateStudent).delete(deleteStudent);


module.exports = router;
