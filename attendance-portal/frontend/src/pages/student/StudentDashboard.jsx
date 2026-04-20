import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Calendar as CalendarIcon, Table2 } from 'lucide-react';
import API from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import SubjectCard from '../../components/student/SubjectCard';
import AttendanceTable from '../../components/student/AttendanceTable';
import CalendarView from '../../components/student/CalendarView';
import Loader from '../../components/common/Loader';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { SUBJECTS, SUBJECT_COLORS, SUBJECT_SHORT, getGreeting } from '../../utils/helpers';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const studentId = user?.studentId;
      if (!studentId) {
        console.error('No student ID found');
        setLoading(false);
        return;
      }
      const { data } = await API.get(`/attendance/summary/${studentId}`);
      setAttendanceData(data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate overall attendance
  const overallPercentage = (() => {
    if (!attendanceData) return 0;
    const values = Object.values(attendanceData);
    if (values.length === 0) return 0;
    const totalPct = values.reduce((sum, v) => sum + v.percentage, 0);
    return Math.round(totalPct / values.length);
  })();

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDateStr = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader text="Loading your dashboard..." />
      </div>
    );
  }

  const activeSubject = SUBJECTS[activeTab];
  const activeData = attendanceData?.[activeSubject];

  return (
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-30 px-4 lg:px-8 py-4"
        style={{
          background: 'rgba(10, 15, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-text-primary">
              {getGreeting()},{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0] || 'Student'}</span>!
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {formatDateStr(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/10 transition-all"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SUBJECTS.map((subject, index) => (
            <SubjectCard
              key={subject}
              subject={subject}
              data={attendanceData?.[subject]}
              index={index}
            />
          ))}
        </div>

        {/* Overall Progress Bar */}
        <motion.div
          className="glass-card p-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-semibold text-text-primary uppercase tracking-wider">
              Overall Attendance
            </h3>
            <span className="font-display text-lg font-bold gradient-text">
              <AnimatedCounter end={overallPercentage} suffix="%" />
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00D4FF, #7C3AED)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${overallPercentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Subject Detail Tabs */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Tab Headers */}
          <div className="flex border-b border-white/5 overflow-x-auto">
            {SUBJECTS.map((subject, index) => {
              const colors = SUBJECT_COLORS[subject];
              const isActive = activeTab === index;
              return (
                <button
                  key={subject}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-center gap-2 px-4 lg:px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: colors.color }}
                  />
                  <span className="hidden sm:inline">{SUBJECT_SHORT[subject]}</span>
                  <span className="sm:hidden">{SUBJECT_SHORT[subject]}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: colors.color, boxShadow: `0 0 10px ${colors.color}` }}
                      layoutId="activeTab"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-5">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {activeSubject}
              </h3>
              <div className="flex items-center bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'table'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Table2 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <CalendarIcon size={16} />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            {activeData && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                  <p className="text-lg font-bold text-text-primary">{activeData.total}</p>
                  <p className="text-[10px] text-text-muted uppercase">Total</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-success/5">
                  <p className="text-lg font-bold text-success">{activeData.present}</p>
                  <p className="text-[10px] text-text-muted uppercase">Present</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-danger/5">
                  <p className="text-lg font-bold text-danger">{activeData.absent}</p>
                  <p className="text-[10px] text-text-muted uppercase">Absent</p>
                </div>
              </div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${viewMode}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === 'table' ? (
                  <AttendanceTable records={activeData?.records || []} />
                ) : (
                  <CalendarView records={activeData?.records || []} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentDashboard;
