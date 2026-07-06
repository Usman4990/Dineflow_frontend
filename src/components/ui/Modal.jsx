// Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  isDarkMode = false 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-955/60 backdrop-blur-md"
          />

          {/* Modal window container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10 ${
              isDarkMode
                ? 'bg-slate-900/90 border-slate-800 text-white'
                : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
            }`}>
              <h2 className="text-sm font-black tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white' 
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                <X className="h-4 w-4 stroke-[3]" />
              </button>
            </div>

            {/* Modal content slot */}
            <div className="max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
