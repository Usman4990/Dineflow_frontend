// AddToOrderButton.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';

export const AddToOrderButton = ({ onClick, isAvailable = true }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isAvailable || isAdded) return;
    
    setIsAdded(true);
    onClick();

    // Revert back after 1.5s
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-red-50 border border-red-200 text-red-700 cursor-not-allowed shadow-none"
      >
        <span>Unavailable</span>
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-lg ${
        isAdded
          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
          : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20'
      }`}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="added"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1.5"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            <span>Added!</span>
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 15, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1.5"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add to Order</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AddToOrderButton;
