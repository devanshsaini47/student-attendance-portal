import { motion } from 'framer-motion';
import { formatDate, getDayOfWeek } from '../../utils/helpers';

const AttendanceTable = ({ records = [] }) => {
  if (!records || records.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p className="text-sm">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[400px] rounded-xl">
      <table className="w-full">
        <thead className="sticky top-0 z-10">
          <tr style={{ background: 'rgba(17, 24, 39, 0.95)' }}>
            <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">
              #
            </th>
            <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">
              Date
            </th>
            <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">
              Day
            </th>
            <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <motion.tr
              key={record._id || index}
              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              style={{
                borderLeft: `3px solid ${
                  record.status === 'Present' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'
                }`,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
            >
              <td className="px-4 py-3 text-sm text-text-muted">{index + 1}</td>
              <td className="px-4 py-3 text-sm text-text-primary">{formatDate(record.date)}</td>
              <td className="px-4 py-3 text-sm text-text-muted">
                {record.dayOfWeek || getDayOfWeek(record.date)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`status-pill ${
                    record.status === 'Present' ? 'status-present' : 'status-absent'
                  }`}
                >
                  {record.status === 'Present' ? '✅' : '❌'} {record.status}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
