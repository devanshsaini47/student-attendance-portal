import { motion } from 'framer-motion';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: '#00D4FF',
            borderRightColor: '#00D4FF',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent"
          style={{
            borderBottomColor: '#7C3AED',
            borderLeftColor: '#7C3AED',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full"
          style={{ background: '#00D4FF' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <motion.p
        className="text-text-muted text-sm font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default Loader;
