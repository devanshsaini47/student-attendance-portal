import { motion } from 'framer-motion';
import { getInitials, getAvatarColor, SUBJECT_COLORS, SUBJECT_SHORT } from '../../utils/helpers';

const StudentRow = ({ student, index, onViewDetails }) => {
  const summary = student.attendanceSummary || {};

  return (
    <motion.div
      className="glass-card-hover p-5 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={() => onViewDetails(student)}
    >
      {/* Avatar & Info */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(
            student.name
          )} flex items-center justify-center text-sm font-bold text-white`}
        >
          {getInitials(student.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-cyan-400 transition-colors">
            {student.name}
          </h3>
          <p className="text-xs text-text-muted">{student.rollNumber}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 text-[10px] font-medium rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {student.branch}
        </span>
        <span className="px-2 py-1 text-[10px] font-medium rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Sem {student.semester}
        </span>
      </div>

      {/* Subject Attendance Bars */}
      <div className="space-y-2">
        {Object.entries(SUBJECT_SHORT).map(([subject, short]) => {
          const data = summary[subject] || { percentage: 0 };
          return (
            <div key={subject} className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted w-8">{short}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: SUBJECT_COLORS[subject]?.color || '#00D4FF' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${data.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.05 + 0.5 }}
                />
              </div>
              <span className="text-[10px] text-text-muted w-8 text-right">{data.percentage}%</span>
            </div>
          );
        })}
      </div>

      {/* View Details */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <button className="text-xs text-cyan-400 font-medium hover:text-cyan-300 transition-colors w-full text-center">
          View Details →
        </button>
      </div>
    </motion.div>
  );
};

export default StudentRow;
