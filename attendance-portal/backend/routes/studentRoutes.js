const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudent,
  getStudentAttendance,
  createStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.get('/', protect, adminOnly, getAllStudents);
router.post('/', protect, adminOnly, createStudent);
router.get('/:id', protect, getStudent);
router.get('/:id/attendance', protect, getStudentAttendance);
router.delete('/:id', protect, adminOnly, deleteStudent);

module.exports = router;
