const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const SUBJECTS = [
  'Compiler Design',
  'Software Engineering',
  'Software Project Management',
  'Computer Networks',
];

const students = [
  { name: 'Aarav Sharma', rollNumber: 'CS2024001', email: 'aarav@student.com' },
  { name: 'Priya Patel', rollNumber: 'CS2024002', email: 'priya@student.com' },
  { name: 'Rohan Gupta', rollNumber: 'CS2024003', email: 'rohan@student.com' },
  { name: 'Sneha Verma', rollNumber: 'CS2024004', email: 'sneha@student.com' },
  { name: 'Arjun Singh', rollNumber: 'CS2024005', email: 'arjun@student.com' },
  { name: 'Kavya Reddy', rollNumber: 'CS2024006', email: 'kavya@student.com' },
  { name: 'Vikram Joshi', rollNumber: 'CS2024007', email: 'vikram@student.com' },
  { name: 'Ananya Das', rollNumber: 'CS2024008', email: 'ananya@student.com' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Attendance.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@portal.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@portal.com / admin123');

    // Create student users and student documents
    const createdStudents = [];
    for (const s of students) {
      const user = await User.create({
        name: s.name,
        email: s.email,
        password: 'student123',
        role: 'student',
        rollNumber: s.rollNumber,
      });

      const student = await Student.create({
        name: s.name,
        rollNumber: s.rollNumber,
        email: s.email,
        branch: 'CSE',
        semester: 6,
        userId: user._id,
      });

      createdStudents.push(student);
      console.log(`🎓 Student created: ${s.name} (${s.rollNumber})`);
    }

    // Generate attendance records for past 45 days
    console.log('\n📊 Generating attendance records...');
    let totalRecords = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let dayOffset = 1; dayOffset <= 45; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);

      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      for (const subject of SUBJECTS) {
        for (const student of createdStudents) {
          // ~75% attendance rate
          const status = Math.random() < 0.75 ? 'Present' : 'Absent';

          await Attendance.create({
            studentId: student._id,
            subject,
            date,
            status,
            markedBy: adminUser._id,
          });
          totalRecords++;
        }
      }
    }

    console.log(`\n✅ Seed complete! Created ${totalRecords} attendance records`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Test Credentials:');
    console.log('  Admin  → admin@portal.com / admin123');
    console.log('  Student → CS2024001 / student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
