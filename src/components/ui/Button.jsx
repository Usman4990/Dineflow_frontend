// Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false, 
  disabled = false, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide rounded-xl focus:outline-none transition-colors duration-200 select-none cursor-pointer';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 border border-transparent disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:shadow-none',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/50 disabled:bg-slate-50 disabled:text-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 border border-transparent disabled:bg-slate-100 disabled:text-slate-400',
    outline: 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 disabled:border-slate-100 disabled:text-slate-400',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/50 disabled:bg-transparent disabled:text-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] rounded-lg',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-6 py-3.5 text-sm rounded-2xl',
  };

  const activeStyle = disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.96 }}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${activeStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
