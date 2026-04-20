import { motion } from 'framer-motion';
import AnimatedCounter from '../common/AnimatedCounter';
import { SUBJECT_COLORS, SUBJECT_SHORT } from '../../utils/helpers';

const CircularProgress = ({ percentage, color, size = 80, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </svg>
  );
};

const SubjectCard = ({ subject, data, index }) => {
  const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS['Compiler Design'];
  const shortName = SUBJECT_SHORT[subject] || subject;
  const percentage = data?.percentage || 0;
  const total = data?.total || 0;
  const present = data?.present || 0;

  const getStatusBadge = () => {
    if (percentage >= 75) return { label: 'Safe ✓', className: 'status-safe' };
    if (percentage >= 60) return { label: 'Warning ⚠', className: 'status-warning' };
    return { label: 'Low ✗', className: 'status-danger' };
  };

  const status = getStatusBadge();

  return (
    <motion.div
      className="glass-card-hover p-5 relative overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      whileHover={{
        boxShadow: `0 0 30px ${colors.bg}, 0 8px 32px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: colors.color }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">
            {shortName}
          </p>
          <h3 className="text-sm font-semibold text-text-primary leading-tight">
            {subject}
          </h3>
        </div>
        <div className="relative flex items-center justify-center">
          <CircularProgress percentage={percentage} color={colors.color} size={70} strokeWidth={5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatedCounter
              end={percentage}
              suffix="%"
              className="text-lg font-bold font-display"
              style={{ color: colors.color }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted mb-3">
        {present} / {total} classes attended
      </p>

      <span className={`status-pill ${status.className}`}>{status.label}</span>
    </motion.div>
  );
};

export default SubjectCard;
