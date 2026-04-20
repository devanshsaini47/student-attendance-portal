import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import API from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import Loader from '../../components/common/Loader';
import SkeletonCard from '../../components/common/SkeletonCard';
import { SUBJECTS, SUBJECT_SHORT, formatDate } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-text-primary font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [todayStatus, setTodayStatus] = useState({});
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, todayRes, reportRes] = await Promise.all([
        API.get('/students'),
        API.get('/attendance/today'),
        API.get('/attendance/report'),
      ]);
      setStudents(studentsRes.data);
      setTodayStatus(todayRes.data);
      setRecentRecords(reportRes.data.slice(0, 10));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalStudents = students.length;
  const classesToday = Object.values(todayStatus).filter((s) => s.marked).length;

  const overallAttendance = (() => {
    if (students.length === 0) return 0;
    let totalPct = 0;
    let count = 0;
    students.forEach((s) => {
      if (s.attendanceSummary) {
        Object.values(s.attendanceSummary).forEach((subj) => {
          totalPct += subj.percentage;
          count++;
        });
      }
    });
    return count > 0 ? Math.round(totalPct / count) : 0;
  })();

  // Chart data
  const barChartData = SUBJECTS.map((subject) => {
    let totalPct = 0;
    let count = 0;
    students.forEach((s) => {
      if (s.attendanceSummary && s.attendanceSummary[subject]) {
        totalPct += s.attendanceSummary[subject].percentage;
        count++;
      }
    });
    return {
      subject: SUBJECT_SHORT[subject],
      fullName: subject,
      attendance: count > 0 ? Math.round(totalPct / count) : 0,
    };
  });

  const pieData = (() => {
    let totalPresent = 0;
    let totalAbsent = 0;
    students.forEach((s) => {
      if (s.attendanceSummary) {
        Object.values(s.attendanceSummary).forEach((subj) => {
          totalPresent += subj.present;
          totalAbsent += subj.absent;
        });
      }
    });
    return [
      { name: 'Present', value: totalPresent },
      { name: 'Absent', value: totalAbsent },
    ];
  })();

  const PIE_COLORS = ['#00D4FF', '#7C3AED'];

  const statCards = [
    {
      label: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: '#00D4FF',
      bg: 'rgba(0, 212, 255, 0.1)',
    },
    {
      label: 'Classes Held Today',
      value: classesToday,
      icon: Calendar,
      color: '#7C3AED',
      bg: 'rgba(124, 58, 237, 0.1)',
    },
    {
      label: 'Overall Attendance',
      value: overallAttendance,
      suffix: '%',
      icon: TrendingUp,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Subjects',
      value: 4,
      icon: BookOpen,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-[260px] p-6">
          <Loader text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 lg:ml-[260px] p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Page Title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-text-primary">
            Dashboard Overview
          </h1>
          <p className="text-sm text-text-muted mt-1">Welcome back! Here's your attendance summary.</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              className="glass-card-hover p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.bg }}
                >
                  <card.icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <div className="font-display text-2xl lg:text-3xl font-bold text-text-primary">
                <AnimatedCounter end={card.value} suffix={card.suffix || ''} />
              </div>
              <p className="text-xs text-text-muted mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
              Attendance by Subject
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="attendance" name="Attendance" fill="#00D4FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
              Present vs Absent
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={5}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Attendance Table */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-5 border-b border-white/5">
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Recent Attendance Records
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th className="text-left text-xs font-semibold text-text-muted px-5 py-3 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted px-5 py-3 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted px-5 py-3 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted px-5 py-3 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record, index) => (
                  <motion.tr
                    key={record._id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <td className="px-5 py-3 text-sm text-text-primary">
                      {record.studentId?.name || 'N/A'}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-muted">
                      {SUBJECT_SHORT[record.subject] || record.subject}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-muted">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`status-pill ${
                          record.status === 'Present' ? 'status-present' : 'status-absent'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-text-muted text-sm">
                      No recent records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
