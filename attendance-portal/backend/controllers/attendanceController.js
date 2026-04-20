const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const SUBJECTS = [
  'Compiler Design',
  'Software Engineering',
  'Software Project Management',
  'Computer Networks',
];

// @desc    Mark attendance (bulk)
// @route   POST /api/attendance/mark
// @access  Private/Admin
const markAttendance = asyncHandler(async (req, res) => {
  const { subject, date, records } = req.body;

  if (!subject || !date || !records || !Array.isArray(records)) {
    res.status(400);
    throw new Error('Please provide subject, date, and records array');
  }

  if (!SUBJECTS.includes(subject)) {
    res.status(400);
    throw new Error('Invalid subject');
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  let count = 0;
  for (const record of records) {
    await Attendance.findOneAndUpdate(
      {
        studentId: record.studentId,
        subject,
        date: attendanceDate,
      },
      {
        studentId: record.studentId,
        subject,
        date: attendanceDate,
        status: record.status,
        markedBy: req.user._id,
      },
      { upsert: true, new: true }
    );
    count++;
  }

  res.json({ success: true, count, message: `Attendance marked for ${count} students` });
});

// @desc    Get attendance summary for a student
// @route   GET /api/attendance/summary/:studentId
// @access  Private
const getAttendanceSummary = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const summary = {};
  for (const subject of SUBJECTS) {
    const records = await Attendance.find({ studentId, subject }).sort({ date: -1 });
    const total = records.length;
    const present = records.filter((r) => r.status === 'Present').length;

    summary[subject] = {
      total,
      present,
      absent: total - present,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      records: records.map((r) => ({
        _id: r._id,
        date: r.date,
        status: r.status,
        dayOfWeek: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
      })),
    };
  }

  res.json(summary);
});

// @desc    Get full report with filters
// @route   GET /api/attendance/report
// @access  Private/Admin
const getReport = asyncHandler(async (req, res) => {
  const { subject, startDate, endDate, studentId } = req.query;
  const query = {};

  if (subject && subject !== 'All') {
    query.subject = subject;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }

  if (studentId) {
    query.studentId = studentId;
  }

  const records = await Attendance.find(query)
    .populate({
      path: 'studentId',
      select: 'name rollNumber branch semester',
    })
    .populate('markedBy', 'name')
    .sort({ date: -1 });

  res.json(records);
});

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private/Admin
const getTodayStatus = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayRecords = await Attendance.find({
    date: { $gte: today, $lt: tomorrow },
  });

  const subjectStatus = {};
  for (const subject of SUBJECTS) {
    const subjectRecords = todayRecords.filter((r) => r.subject === subject);
    subjectStatus[subject] = {
      marked: subjectRecords.length > 0,
      count: subjectRecords.length,
      present: subjectRecords.filter((r) => r.status === 'Present').length,
      absent: subjectRecords.filter((r) => r.status === 'Absent').length,
    };
  }

  res.json(subjectStatus);
});

module.exports = { markAttendance, getAttendanceSummary, getReport, getTodayStatus };
