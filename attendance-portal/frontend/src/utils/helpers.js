import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM dd');
};

export const getDayOfWeek = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE');
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name) => {
  const colors = [
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-cyan-500',
    'from-fuchsia-500 to-purple-500',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const SUBJECTS = [
  'Compiler Design',
  'Software Engineering',
  'Software Project Management',
  'Computer Networks',
];

export const SUBJECT_COLORS = {
  'Compiler Design': { color: '#00D4FF', bg: 'rgba(0, 212, 255, 0.15)', border: 'rgba(0, 212, 255, 0.3)' },
  'Software Engineering': { color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.15)', border: 'rgba(124, 58, 237, 0.3)' },
  'Software Project Management': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' },
  'Computer Networks': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
};

export const SUBJECT_SHORT = {
  'Compiler Design': 'CD',
  'Software Engineering': 'SE',
  'Software Project Management': 'SPM',
  'Computer Networks': 'CN',
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h] || '';
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
