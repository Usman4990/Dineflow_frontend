// CategoryFilter.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const CategoryFilter = ({ categories = [], selected, onSelect, isDarkMode = false }) => {
  // Ensure 'All' is the first category in the filter tabs
  const list = ['All', ...categories.filter((cat) => cat !== 'All')];

  return (
    <div className={`sticky top-[4rem] z-30 -mx-4 px-4 py-3 sm:mx-0 sm:px-0 backdrop-blur-xl border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-950/80 border-slate-900/60 shadow-[0_10px_30px_rgba(0,0,0,0.3)]' 
        : 'bg-white/80 border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)]'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <div className={`flex p-1.5 rounded-2xl border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/50 border-slate-800/80' 
            : 'bg-slate-100/50 border-slate-200/40'
        }`}>
          {list.map((category) => {
            const isSelected = selected === category;
            return (
              <button
                key={category}
                onClick={() => onSelect(category)}
                className={`relative whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-colors duration-300 focus:outline-none ${
                  isSelected
                    ? 'text-white font-extrabold'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl -z-10 shadow-lg shadow-orange-500/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
