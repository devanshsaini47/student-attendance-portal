const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(400);
    throw new Error('Please provide email, password, and role');
  }

  // For students logging in with roll number
  let user;
  if (role === 'student') {
    // Try finding by roll number first, then by email
    const student = await Student.findOne({ rollNumber: email });
    if (student) {
      user = await User.findById(student.userId);
    } else {
      user = await User.findOne({ email });
    }
  } else {
    user = await User.findOne({ email });
  }

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.role !== role) {
    res.status(401);
    throw new Error(`This account is not registered as ${role}`);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Get student info if student role
  let studentInfo = null;
  if (user.role === 'student') {
    studentInfo = await Student.findOne({ userId: user._id });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNumber: user.rollNumber || (studentInfo ? studentInfo.rollNumber : null),
    studentId: studentInfo ? studentInfo._id : null,
    token: generateToken(user._id),
  });
});

// @desc    Register user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, rollNumber, branch, semester } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    rollNumber: rollNumber || undefined,
  });

  // If student role, create student document
  if (role === 'student' && rollNumber) {
    await Student.create({
      name,
      rollNumber,
      email,
      branch: branch || 'CSE',
      semester: semester || 6,
      userId: user._id,
    });
  }

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  let studentInfo = null;

  if (user.role === 'student') {
    studentInfo = await Student.findOne({ userId: user._id });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNumber: user.rollNumber || (studentInfo ? studentInfo.rollNumber : null),
    studentId: studentInfo ? studentInfo._id : null,
  });
});

module.exports = { loginUser, registerUser, getMe };
