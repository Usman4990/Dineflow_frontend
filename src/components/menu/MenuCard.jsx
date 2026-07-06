// MenuCard.jsx
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import AddToOrderButton from './AddToOrderButton';

export const MenuCard = ({ item, isDarkMode = false }) => {
  const { addToCart } = useCart();
  const isAvailable = item.is_available ?? true;

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(item);
    }
  };

  // 3D Tilt Effect Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full pt-12">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.2, ease: 'easeOut' }
        }}
        className={`group relative flex flex-col h-full rounded-3xl border transition-all duration-300 p-6 ${
          isDarkMode
            ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)]'
            : 'bg-white/70 border-slate-100 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)]'
        } ${!isAvailable ? 'opacity-70 grayscale-[15%]' : ''}`}
      >
        {/* Floating Ambient Shadow Behind Image */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-slate-950/20 blur-xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 pointer-events-none z-0" />

        {/* Floating Food Image Container */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden p-1 z-20 bg-gradient-to-tr from-orange-500/30 to-amber-400/30 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 shadow-[0_12px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
          <div className={`w-full h-full rounded-full overflow-hidden border-4 ${
            isDarkMode ? 'border-slate-900 bg-slate-800' : 'border-white bg-slate-100'
          }`}>
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
              alt={item.name}
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center p-2 text-center">
              <span className="text-[8px] font-extrabold text-white tracking-widest uppercase">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="mt-20 flex-grow flex flex-col pt-2" style={{ transform: 'translateZ(30px)' }}>
          {/* Tags / Badges */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
              isDarkMode 
                ? 'bg-slate-800/80 text-slate-300 border border-slate-700/50' 
                : 'bg-slate-100 text-slate-600 border border-slate-200/50'
            }`}>
              {item.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
              isAvailable
                ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>

          {/* Item Name */}
          <h3 className={`text-base font-extrabold tracking-tight transition-colors duration-300 ${
            isDarkMode 
              ? 'text-white group-hover:text-amber-400' 
              : 'text-slate-900 group-hover:text-orange-500'
          }`}>
            {item.name}
          </h3>
          
          {/* Description */}
          <p className={`mt-2 text-xs line-clamp-2 leading-relaxed flex-grow ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {item.description || 'No description provided.'}
          </p>

          {!isAvailable && (
            <p className="mt-3 text-[9px] font-bold text-red-500 bg-red-500/5 p-2 rounded-xl border border-red-500/10 text-center">
              Currently Unavailable.
            </p>
          )}

          {/* Footer Area with Price and Cart Button */}
          <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <div className="flex flex-col">
              <span className={`text-[9px] uppercase font-extrabold tracking-widest ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Price
              </span>
              <span className={`text-lg font-black tracking-tight ${
                isDarkMode ? 'text-amber-400' : 'text-slate-900'
              }`}>
                {formatCurrency(item.price)}
              </span>
            </div>

            <AddToOrderButton
              onClick={handleAddToCart}
              isAvailable={isAvailable}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MenuCard;
