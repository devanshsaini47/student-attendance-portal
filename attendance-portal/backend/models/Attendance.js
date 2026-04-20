const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    subject: {
      type: String,
      enum: [
        'Compiler Design',
        'Software Engineering',
        'Software Project Management',
        'Computer Networks',
      ],
      required: [true, 'Subject is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'],
      required: [true, 'Status is required'],
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attendance entries
attendanceSchema.index({ studentId: 1, subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
