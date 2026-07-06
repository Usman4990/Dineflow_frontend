// Badge.jsx
import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant] || styles.neutral} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
