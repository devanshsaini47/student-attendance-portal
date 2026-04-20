const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceSummary,
  getReport,
  getTodayStatus,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/mark', protect, adminOnly, markAttendance);
router.get('/summary/:studentId', protect, getAttendanceSummary);
router.get('/report', protect, adminOnly, getReport);
router.get('/today', protect, adminOnly, getTodayStatus);

module.exports = router;
