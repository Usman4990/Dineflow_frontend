// Input.jsx
import React from 'react';

export const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          type={type}
          className={`block w-full pr-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white/50 dark:bg-slate-950/40 backdrop-blur-sm transition-all duration-200 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${
            error
              ? 'border-red-300 focus:ring-red-100 focus:border-red-500 dark:border-red-950 dark:focus:ring-red-950/30 dark:focus:border-red-500'
              : 'border-slate-200 dark:border-slate-800/80 focus:ring-orange-100 focus:border-orange-500 dark:focus:ring-orange-950/30 dark:focus:border-orange-500'
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-650 dark:text-red-400 font-bold mt-1">{error}</p>}
    </div>
  );
};

export default Input;
