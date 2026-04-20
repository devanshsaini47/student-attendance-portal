import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import useAuth from './hooks/useAuth';
import Loader from './components/common/Loader';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MarkAttendance from './pages/admin/MarkAttendance';
import AllStudents from './pages/admin/AllStudents';
import Reports from './pages/admin/Reports';
import StudentDashboard from './pages/student/StudentDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <Loader text="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Page transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  >
    {children}
  </motion.div>
);

// 404 Page
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-midnight">
    <motion.h1
      className="font-display text-8xl lg:text-9xl font-bold gradient-text animate-glitch"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      404
    </motion.h1>
    <motion.p
      className="text-text-muted text-lg mt-4 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Oops! Page not found
    </motion.p>
    <motion.a
      href="/"
      className="glow-btn px-6 py-3 text-sm font-semibold"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      Back to Login
    </motion.a>
  </div>
);

const App = () => {
  const location = useLocation();

  return (
    <>
      {/* Toast Configuration */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(17, 24, 39, 0.9)',
            color: '#F1F5F9',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#0A0F1E',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#0A0F1E',
            },
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route
            path="/"
            element={
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWrapper>
                  <AdminDashboard />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mark-attendance"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWrapper>
                  <MarkAttendance />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWrapper>
                  <AllStudents />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWrapper>
                  <Reports />
                </PageWrapper>
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <PageWrapper>
                  <StudentDashboard />
                </PageWrapper>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFoundPage />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
