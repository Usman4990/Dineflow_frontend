// Card.jsx
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const Card = ({ 
  children, 
  tilt = false, 
  isDarkMode = false, 
  className = '', 
  ...props 
}) => {
  // 3D Tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e) => {
    if (!tilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    x.set(0);
    y.set(0);
  };

  const motionProps = tilt ? {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: { rotateX, rotateY, transformStyle: 'preserve-3d' },
    whileHover: { y: -4, transition: { duration: 0.2 } }
  } : {};

  return (
    <div style={tilt ? { perspective: 1000 } : undefined} className={tilt ? 'pt-2 h-full' : 'h-full'}>
      <motion.div
        {...motionProps}
        className={`rounded-3xl border transition-all duration-300 h-full ${
          isDarkMode
            ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-xl shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/45'
            : 'bg-white/70 border-slate-100 backdrop-blur-xl shadow-md shadow-slate-100/30 hover:shadow-lg hover:shadow-slate-200/50'
        } ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Card;
