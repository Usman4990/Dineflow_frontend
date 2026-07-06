// StatCard.jsx
import React from 'react';
import Card from '../ui/Card';

export const StatCard = ({ label, value, icon: Icon, color = 'orange' }) => {
  const colorMap = {
    orange: 'from-orange-500/20 to-amber-500/5 text-orange-400 border-orange-500/20 shadow-orange-500/5',
    blue: 'from-blue-500/20 to-indigo-500/5 text-blue-400 border-blue-500/20 shadow-blue-500/5',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-450 border-emerald-500/20 shadow-emerald-500/5',
    violet: 'from-violet-500/20 to-purple-500/5 text-violet-400 border-violet-500/20 shadow-violet-500/5',
    amber: 'from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/20 shadow-amber-500/5',
    red: 'from-red-500/20 to-rose-500/5 text-red-400 border-red-500/20 shadow-red-500/5',
  };

  const scheme = colorMap[color] || colorMap.orange;

  return (
    <Card tilt={true} isDarkMode={true} className="p-6 flex items-center justify-between border-slate-800/80 bg-slate-900/40 backdrop-blur-xl relative overflow-hidden group">
      {/* Background glow highlight */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-tr ${scheme.split(' ')[0]} ${scheme.split(' ')[1]} blur-xl opacity-20 transition-all group-hover:scale-125`} />

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
          {label}
        </span>
        <span className="text-2xl font-black text-white tracking-tight block">
          {value}
        </span>
      </div>

      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${scheme.split(' ')[0]} ${scheme.split(' ')[1]} ${scheme.split('.').join('')} border ${scheme.split(' ')[3]} shadow-lg ${scheme.split(' ')[4]} relative z-10 transition-transform duration-350 group-hover:scale-110`}>
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
};

export default StatCard;
