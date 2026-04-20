import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AttendanceForm from '../../components/admin/AttendanceForm';
import Loader from '../../components/common/Loader';
import { SUBJECTS } from '../../utils/helpers';

const MarkAttendance = () => {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const loadStudents = async () => {
    if (!subject) {
      toast.error('Please select a subject');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.get('/students');
      setStudents(data);
      setAttendance({});
      setShowStudents(true);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? undefined : status,
    }));
  };

  const handleSelectAll = (status) => {
    const newAttendance = {};
    students.forEach((s) => {
      newAttendance[s._id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    const records = Object.entries(attendance)
      .filter(([, status]) => status)
      .map(([studentId, status]) => ({ studentId, status }));

    if (records.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setSubmitting(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      await API.post('/attendance/mark', {
        subject,
        date: dateStr,
        records,
      });
      toast.success(`Attendance marked for ${records.length} students!`, {
        icon: '🎉',
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 lg:ml-[260px] p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Confetti */}
        <AnimatePresence>
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{
                    background: ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: '-20px',
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 720,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: 'easeIn',
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-text-primary">
            Mark Attendance
          </h1>
          <p className="text-sm text-text-muted mt-1">Select a subject and date to mark attendance</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="glass-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="glass-select"
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">
                Date
              </label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                maxDate={new Date()}
                className="glass-input w-full"
                dateFormat="MMM dd, yyyy"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={loadStudents}
                disabled={loading || !subject}
                className="glow-btn w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load Students'
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Student Attendance List */}
        <AnimatePresence>
          {showStudents && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <Loader text="Loading students..." />
              ) : (
                <>
                  <AttendanceForm
                    students={students}
                    attendance={attendance}
                    onToggle={handleToggle}
                    onSelectAll={handleSelectAll}
                  />

                  {/* Submit Button */}
                  <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="glow-btn w-full py-4 text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Saving Attendance...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          Submit Attendance
                        </>
                      )}
                    </button>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MarkAttendance;
