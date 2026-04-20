import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Zap, BarChart3, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Particle canvas animation for login
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.5 + 0.2),
      opacity: Math.random() * 0.6 + 0.1,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.opacity += p.fadeDir * 0.005;
        if (p.opacity <= 0.1 || p.opacity >= 0.7) p.fadeDir *= -1;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await login({ email, password, role });
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: Clock, label: 'Real-time Tracking' },
    { icon: BarChart3, label: 'Smart Analytics' },
    { icon: Zap, label: 'Instant Reports' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        {/* Gradient mesh background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(-45deg, #0A0F1E, #1a1040, #0d2137, #0A0F1E, #15103a)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 8s ease infinite',
          }}
        />

        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <motion.div
            className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              boxShadow: '0 0 60px rgba(0, 212, 255, 0.3)',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <GraduationCap size={48} className="text-cyan-400" />
          </motion.div>

          <motion.h1
            className="font-display text-5xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            EduTrack
          </motion.h1>

          <motion.p
            className="text-text-muted text-lg mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Attendance Management System
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-text-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0,212,255,0.2)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <f.icon size={16} className="text-cyan-400" />
                <span>{f.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-midnight">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)',
              }}
            >
              <GraduationCap size={32} className="text-cyan-400" />
            </div>
            <h1 className="font-display text-3xl font-bold gradient-text">EduTrack</h1>
          </div>

          <div className="glass-card p-8">
            <motion.h2
              className="font-display text-2xl font-bold text-text-primary mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome Back
            </motion.h2>
            <p className="text-text-muted text-sm mb-6">Sign in to continue to your dashboard</p>

            {/* Role Toggle */}
            <div className="relative flex bg-white/5 rounded-xl p-1 mb-6">
              <motion.div
                className="absolute top-1 bottom-1 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #00D4FF, #0099CC)',
                  width: 'calc(50% - 4px)',
                }}
                animate={{ x: role === 'admin' ? 0 : '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              {['admin', 'student'].map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setEmail(''); setError(''); }}
                  className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-300 uppercase tracking-wider ${
                    role === r ? 'text-midnight' : 'text-text-muted'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Roll Number */}
              <div>
                <label className="block text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">
                  {role === 'admin' ? 'Email Address' : 'Roll Number'}
                </label>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input"
                  placeholder={role === 'admin' ? 'admin@portal.com' : 'CS2024001'}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/30"
                  />
                  <span className="text-xs text-text-muted">Remember me</span>
                </label>
                <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot Password?
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="glow-btn w-full py-3.5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
          </div>

          {/* Demo Credentials */}
          <motion.div
            className="mt-6 glass-card p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">
              Demo Credentials
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-medium">Admin</span>
                <span className="text-text-muted">admin@portal.com / admin123</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-medium">Student</span>
                <span className="text-text-muted">CS2024001 / student123</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
