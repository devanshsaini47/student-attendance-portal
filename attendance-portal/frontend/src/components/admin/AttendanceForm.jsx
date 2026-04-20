import { motion } from 'framer-motion';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const AttendanceForm = ({ students, attendance, onToggle, onSelectAll }) => {
  const presentCount = Object.values(attendance).filter((s) => s === 'Present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'Absent').length;
  const unmarkedCount = students.length - presentCount - absentCount;

  return (
    <div>
      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => onSelectAll('Present')}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-success/15 text-success border border-success/30 hover:bg-success/25 transition-all"
        >
          ✓ Select All Present
        </button>
        <button
          onClick={() => onSelectAll('Absent')}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25 transition-all"
        >
          ✗ Select All Absent
        </button>
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {students.map((student, index) => (
          <motion.div
            key={student._id}
            className="glass-card-hover p-4 flex items-center justify-between gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(
                  student.name
                )} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}
              >
                {getInitials(student.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{student.name}</p>
                <p className="text-xs text-text-muted">{student.rollNumber}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onToggle(student._id, 'Present')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  attendance[student._id] === 'Present'
                    ? 'bg-success text-white shadow-lg shadow-success/30'
                    : 'bg-white/5 text-text-muted border border-white/10 hover:border-success/50 hover:text-success'
                }`}
              >
                ✓ Present
              </button>
              <button
                onClick={() => onToggle(student._id, 'Absent')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  attendance[student._id] === 'Absent'
                    ? 'bg-danger text-white shadow-lg shadow-danger/30'
                    : 'bg-white/5 text-text-muted border border-white/10 hover:border-danger/50 hover:text-danger'
                }`}
              >
                ✗ Absent
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Bar */}
      {students.length > 0 && (
        <motion.div
          className="mt-4 glass-card p-4 flex flex-wrap items-center justify-center gap-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-success font-medium">{presentCount} Present</span>
          <span className="text-white/20">|</span>
          <span className="text-danger font-medium">{absentCount} Absent</span>
          <span className="text-white/20">|</span>
          <span className="text-text-muted font-medium">{unmarkedCount} Not Marked</span>
        </motion.div>
      )}
    </div>
  );
};

export default AttendanceForm;
