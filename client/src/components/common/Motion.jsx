import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/**
 * FadeIn Component
 * Slips in from a direction with a fade.
 */
export const FadeIn = ({ children, direction = 'up', delay = 0, duration = 0.6, className = '' }) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom ease-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger Container
 * Animates children one by one.
 */
export const Stagger = ({ children, staggerDelay = 0.1, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, direction = 'up' }) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directions[direction] },
        show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Magnetic Component
 * Attracts to the mouse within a certain radius.
 */
export const Magnetic = ({ children, strength = 0.5 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * strength;
    const y = (clientY - centerY) * strength;
    setPosition({ x, y });
  };

  const handlePointerLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.5 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

/**
 * Reveal Component
 * Clip-path wipe reveal.
 */
export const Reveal = ({ children, delay = 0, duration = 0.8, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * CountUp Component
 * Animated number.
 */
export const CountUp = ({ end, duration = 2, delay = 0, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        let start = 0;
        const totalSteps = duration * 60;
        const increment = end / totalSteps;
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 1000 / 60);
      }, delay * 1000);
    }
  }, [inView, end, duration, delay]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};
