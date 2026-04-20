const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const SUBJECTS = [
  'Compiler Design',
  'Software Engineering',
  'Software Project Management',
  'Computer Networks',
];

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().populate('userId', 'name email role').sort({ rollNumber: 1 });

  // Get attendance summary for each student
  const studentsWithAttendance = await Promise.all(
    students.map(async (student) => {
      const attendanceSummary = {};
      for (const subject of SUBJECTS) {
        const total = await Attendance.countDocuments({
          studentId: student._id,
          subject,
        });
        const present = await Attendance.countDocuments({
          studentId: student._id,
          subject,
          status: 'Present',
        });
        attendanceSummary[subject] = {
          total,
          present,
          absent: total - present,
          percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        };
      }

      return {
        ...student.toObject(),
        attendanceSummary,
      };
    })
  );

  res.json(studentsWithAttendance);
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('userId', 'name email role');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json(student);
});

// @desc    Get student attendance records
// @route   GET /api/students/:id/attendance
// @access  Private
const getStudentAttendance = asyncHandler(async (req, res) => {
  const { subject } = req.query;
  const query = { studentId: req.params.id };

  if (subject) {
    query.subject = subject;
  }

  const records = await Attendance.find(query)
    .sort({ date: -1 })
    .populate('markedBy', 'name');

  // Group by subject
  const grouped = {};
  for (const subj of SUBJECTS) {
    const subjectRecords = records.filter((r) => r.subject === subj);
    const total = subjectRecords.length;
    const present = subjectRecords.filter((r) => r.status === 'Present').length;

    grouped[subj] = {
      total,
      present,
      absent: total - present,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      records: subjectRecords.map((r) => ({
        _id: r._id,
        date: r.date,
        status: r.status,
        dayOfWeek: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
      })),
    };
  }

  res.json(grouped);
});

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const { name, rollNumber, email, branch, semester, password } = req.body;

  const existingStudent = await Student.findOne({ rollNumber });
  if (existingStudent) {
    res.status(400);
    throw new Error('Student with this roll number already exists');
  }

  // Create user account
  const user = await User.create({
    name,
    email,
    password: password || 'student123',
    role: 'student',
    rollNumber,
  });

  // Create student document
  const student = await Student.create({
    name,
    rollNumber,
    email,
    branch: branch || 'CSE',
    semester: semester || 6,
    userId: user._id,
  });

  res.status(201).json(student);
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Delete associated attendance records
  await Attendance.deleteMany({ studentId: student._id });

  // Delete user account
  await User.findByIdAndDelete(student.userId);

  // Delete student
  await Student.findByIdAndDelete(req.params.id);

  res.json({ message: 'Student removed successfully' });
});

module.exports = { getAllStudents, getStudent, getStudentAttendance, createStudent, deleteStudent };
