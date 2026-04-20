import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '', decimals = 0, className = '' }) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <CountUp
        end={end}
        duration={duration}
        suffix={suffix}
        prefix={prefix}
        decimals={decimals}
        enableScrollSpy
        scrollSpyOnce
      />
    </motion.span>
  );
};

export default AnimatedCounter;
