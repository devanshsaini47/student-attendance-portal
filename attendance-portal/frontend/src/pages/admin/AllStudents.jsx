import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import API from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StudentRow from '../../components/admin/StudentRow';
import Loader from '../../components/common/Loader';
import { SUBJECTS, SUBJECT_COLORS, SUBJECT_SHORT, getInitials, getAvatarColor } from '../../utils/helpers';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAttendance, setStudentAttendance] = useState(null);
  const [panelLoading, setPanelLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(students);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        students.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.rollNumber.toLowerCase().includes(q) ||
            s.branch.toLowerCase().includes(q)
        )
      );
    }
  }, [search, students]);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/students');
      setStudents(data);
      setFiltered(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setPanelLoading(true);
    try {
      const { data } = await API.get(`/students/${student._id}/attendance`);
      setStudentAttendance(data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setPanelLoading(false);
    }
  };

  const closePanel = () => {
    setSelectedStudent(null);
    setStudentAttendance(null);
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-[260px] p-6">
          <Loader text="Loading students..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 lg:ml-[260px] p-4 lg:p-8 pb-24 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-text-primary">
            All Students
          </h1>
          <p className="text-sm text-text-muted mt-1">{students.length} students enrolled</p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, roll number, branch..."
              className="glass-input pl-11"
            />
          </div>
        </motion.div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((student, index) => (
            <StudentRow
              key={student._id}
              student={student}
              index={index}
              onViewDetails={handleViewDetails}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-text-muted">
              <p>No students found matching "{search}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto"
              style={{
                background: 'rgba(17, 24, 39, 0.95)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-text-primary">
                    Student Details
                  </h2>
                  <button
                    onClick={closePanel}
                    className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(
                      selectedStudent.name
                    )} flex items-center justify-center text-xl font-bold text-white`}
                  >
                    {getInitials(selectedStudent.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-sm text-text-muted">{selectedStudent.rollNumber}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                        {selectedStudent.branch}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                        Sem {selectedStudent.semester}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Breakdown */}
                {panelLoading ? (
                  <Loader text="Loading attendance..." />
                ) : (
                  studentAttendance && (
                    <div className="space-y-4">
                      <h3 className="font-display text-sm font-semibold text-text-muted uppercase tracking-wider">
                        Attendance Breakdown
                      </h3>
                      {SUBJECTS.map((subject) => {
                        const data = studentAttendance[subject] || {
                          total: 0,
                          present: 0,
                          absent: 0,
                          percentage: 0,
                        };
                        const colors = SUBJECT_COLORS[subject];
                        const circumference = 2 * Math.PI * 35;
                        const offset = circumference - (data.percentage / 100) * circumference;

                        return (
                          <motion.div
                            key={subject}
                            className="glass-card p-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative flex-shrink-0">
                                <svg width="80" height="80" className="transform -rotate-90">
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="35"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="6"
                                    fill="none"
                                  />
                                  <motion.circle
                                    cx="40"
                                    cy="40"
                                    r="35"
                                    stroke={colors.color}
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: offset }}
                                    transition={{ duration: 1.2, ease: 'easeOut' }}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold" style={{ color: colors.color }}>
                                    {data.percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-text-primary">
                                  {SUBJECT_SHORT[subject]} — {subject}
                                </h4>
                                <div className="flex gap-4 mt-1 text-xs text-text-muted">
                                  <span>Total: {data.total}</span>
                                  <span className="text-success">Present: {data.present}</span>
                                  <span className="text-danger">Absent: {data.absent}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllStudents;
