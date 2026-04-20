const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
