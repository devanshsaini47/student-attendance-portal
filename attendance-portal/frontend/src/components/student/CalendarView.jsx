import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { parseISO, isSameDay } from 'date-fns';

const CalendarView = ({ records = [] }) => {
  const presentDates = records
    .filter((r) => r.status === 'Present')
    .map((r) => (typeof r.date === 'string' ? parseISO(r.date) : new Date(r.date)));

  const absentDates = records
    .filter((r) => r.status === 'Absent')
    .map((r) => (typeof r.date === 'string' ? parseISO(r.date) : new Date(r.date)));

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const isPresent = presentDates.some((d) => isSameDay(d, date));
    const isAbsent = absentDates.some((d) => isSameDay(d, date));

    if (isPresent) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
      );
    }
    if (isAbsent) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const isPresent = presentDates.some((d) => isSameDay(d, date));
    const isAbsent = absentDates.some((d) => isSameDay(d, date));
    if (isPresent) return 'present-day';
    if (isAbsent) return 'absent-day';
    return '';
  };

  return (
    <div>
      <Calendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        locale="en-US"
      />
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs text-text-muted">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-xs text-text-muted">Absent</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
