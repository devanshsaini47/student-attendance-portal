import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  BarChart3,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/mark-attendance', icon: ClipboardCheck, label: 'Mark Attendance' },
  { to: '/admin/students', icon: Users, label: 'All Students' },
  { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] z-40"
        style={{
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
            }}
          >
            <GraduationCap size={24} className="text-cyan-500" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg gradient-text">EduTrack</h1>
            <p className="text-[10px] text-text-muted tracking-wider uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-400'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/5 border-l-2 border-transparent'
                  }`
                }
              >
                <item.icon
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/10 transition-all duration-300 w-full border-l-2 border-transparent"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[11px] text-cyan-400 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40" style={{
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <nav className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? 'text-cyan-400' : 'text-text-muted'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-medium text-text-muted hover:text-danger transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
