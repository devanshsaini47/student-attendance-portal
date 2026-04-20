import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Download, Filter, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { SUBJECTS, SUBJECT_SHORT, formatDate, exportToCSV } from '../../utils/helpers';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    fetchStudentList();
  }, []);

  const fetchStudentList = async () => {
    try {
      const { data } = await API.get('/students');
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (subject !== 'All') params.subject = subject;
      if (startDate) params.startDate = startDate.toISOString().split('T')[0];
      if (endDate) params.endDate = endDate.toISOString().split('T')[0];
      if (studentId) params.studentId = studentId;

      const { data } = await API.get('/attendance/report', { params });
      setRecords(data);

      if (data.length === 0) {
        toast('No records found for the selected filters', { icon: 'ℹ️' });
      }
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let valA, valB;
    switch (sortField) {
      case 'date':
        valA = new Date(a.date);
        valB = new Date(b.date);
        break;
      case 'student':
        valA = a.studentId?.name || '';
        valB = b.studentId?.name || '';
        break;
      case 'subject':
        valA = a.subject;
        valB = b.subject;
        break;
      case 'status':
        valA = a.status;
        valB = b.status;
        break;
      default:
        return 0;
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleExport = () => {
    if (records.length === 0) {
      toast.error('No data to export');
      return;
    }
    const csvData = records.map((r) => ({
      Student: r.studentId?.name || 'N/A',
      'Roll Number': r.studentId?.rollNumber || 'N/A',
      Subject: r.subject,
      Date: formatDate(r.date),
      Status: r.status,
    }));
    exportToCSV(csvData, `attendance_report_${new Date().toISOString().split('T')[0]}`);
    toast.success('CSV exported successfully!');
  };

  const SortHeader = ({ field, children }) => (
    <th
      className="text-left text-xs font-semibold text-text-muted px-5 py-3 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown size={12} className={sortField === field ? 'text-cyan-400' : 'opacity-30'} />
      </div>
    </th>
  );

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
            Attendance Reports
          </h1>
          <p className="text-sm text-text-muted mt-1">Generate and export attendance reports</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="glass-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-cyan-400" />
            <h3 className="font-display text-sm font-semibold text-text-primary uppercase tracking-wider">
              Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-text-muted font-medium mb-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="glass-select"
              >
                <option value="All">All Subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-muted font-medium mb-2">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(d) => setStartDate(d)}
                className="glass-input w-full"
                placeholderText="Select start date"
                dateFormat="MMM dd, yyyy"
                isClearable
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted font-medium mb-2">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(d) => setEndDate(d)}
                className="glass-input w-full"
                placeholderText="Select end date"
                dateFormat="MMM dd, yyyy"
                isClearable
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted font-medium mb-2">Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="glass-select"
              >
                <option value="">All Students</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={generateReport} disabled={loading} className="glow-btn px-6 py-2.5 text-sm font-semibold">
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
            {records.length > 0 && (
              <motion.button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-success/15 text-success border border-success/30 hover:bg-success/25 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Download size={16} />
                Export CSV
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Results Table */}
        {loading ? (
          <Loader text="Generating report..." />
        ) : records.length > 0 ? (
          <motion.div
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-text-primary">
                {records.length} records found
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <SortHeader field="student">Student</SortHeader>
                    <th className="text-left text-xs font-semibold text-text-muted px-5 py-3 uppercase tracking-wider">
                      Roll No
                    </th>
                    <SortHeader field="subject">Subject</SortHeader>
                    <SortHeader field="date">Date</SortHeader>
                    <SortHeader field="status">Status</SortHeader>
                  </tr>
                </thead>
                <tbody>
                  {sortedRecords.map((record, index) => (
                    <motion.tr
                      key={record._id}
                      className={`border-b border-white/5 hover:bg-white/[0.02] ${
                        index % 2 === 0 ? '' : 'bg-white/[0.01]'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <td className="px-5 py-3 text-sm text-text-primary">
                        {record.studentId?.name || 'N/A'}
                      </td>
                      <td className="px-5 py-3 text-sm text-text-muted">
                        {record.studentId?.rollNumber || 'N/A'}
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
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : null}
      </main>
    </div>
  );
};

export default Reports;
