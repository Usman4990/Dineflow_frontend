// OrderStatusStepper.jsx
import React from 'react';
import { ClipboardList, ChefHat, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderStatusStepper = ({ status }) => {
  const steps = [
    { label: 'Pending',   icon: ClipboardList, val: 'Pending' },
    { label: 'Preparing', icon: ChefHat,        val: 'Preparing' },
    { label: 'Completed', icon: CheckCircle2,   val: 'Completed' },
  ];

  const getStepIndex = (s) => {
    if (s === 'Pending')   return 0;
    if (s === 'Preparing') return 1;
    if (s === 'Completed') return 2;
    return 0;
  };

  const currentIndex = getStepIndex(status);
  const progressPct  = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Track backdrop */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full bg-slate-800 -translate-y-1/2 rounded-full" />

        {/* Active track */}
        <motion.div
          className="absolute left-0 top-1/2 h-0.5 bg-orange-500 -translate-y-1/2 rounded-full origin-left"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {steps.map((step, index) => {
          const StepIcon    = step.icon;
          const isCompleted = index < currentIndex;
          const isActive    = index === currentIndex;

          let circleClass = 'bg-slate-900 border-slate-700 text-slate-600';
          if (isActive) {
            circleClass =
              'bg-[#0c101c] border-orange-500 text-orange-500 ring-4 ring-orange-500/10 scale-110 shadow-lg shadow-orange-500/10';
          } else if (isCompleted) {
            circleClass = 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20';
          }

          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${circleClass}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: isActive ? 1.1 : 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
              >
                <StepIcon className="h-4 w-4" />
              </motion.div>

              <span className={`mt-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                isActive    ? 'text-orange-400 scale-105' :
                isCompleted ? 'text-orange-500/60'        : 'text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusStepper;
