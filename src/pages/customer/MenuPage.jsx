// MenuPage.jsx
import React, { useState, useEffect } from 'react';
import { useMenu } from '../../hooks/useMenu';
import CustomerLayout from '../../components/layout/CustomerLayout';
import CategoryFilter from '../../components/menu/CategoryFilter';
import MenuCard from '../../components/menu/MenuCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const MenuPage = () => {
  const { menuItems, loading, error } = useMenu(false); // Fetches only available items
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Default to premium dark theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Extract list of unique categories from menu items
  const categories = menuItems.length > 0
    ? [...new Set(menuItems.map((item) => item.category))]
    : [];

  // Filter items
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  // Stagger variants for the menu items
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 24 
      } 
    }
  };

  return (
    <CustomerLayout>
      <div className={`relative overflow-hidden min-h-screen transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#070b13] text-slate-100 -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 sm:px-6 lg:px-8 py-8' 
          : 'bg-[#fafaf9] text-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 sm:px-6 lg:px-8 py-8'
      }`}>
        
        {/* Glow Blobs for Depth & Parallax */}
        <div className={`absolute top-1/4 left-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[160px] pointer-events-none z-0 transition-colors duration-500 ${
          isDarkMode ? 'bg-orange-500/10' : 'bg-orange-300/20'
        }`} />
        <div className={`absolute bottom-1/4 right-10 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full blur-[100px] sm:blur-[160px] pointer-events-none z-0 transition-colors duration-500 ${
          isDarkMode ? 'bg-amber-500/5' : 'bg-amber-300/15'
        }`} />

        {/* Hero Banner Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl z-10 border border-white/5">
          {/* Hero background image with parallax blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-[2px] transition-transform duration-700" 
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
          
          <div className="relative max-w-2xl px-8 py-16 sm:px-12 sm:py-20 md:max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-md border border-white/10"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>DineFlow Gastronomy</span>
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none"
            >
              Savor the Art of <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Fine Dining
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed"
            >
              Indulge in a premium selection of culinary masterpieces. From traditional Pakistani sizzlers to contemporary international favorites, crafted with passion.
            </motion.p>
          </div>
        </div>

        {/* Main Catalog Area */}
        <div className="relative z-10 space-y-8">
          
          {/* Header Area with Filter Header & Theme Toggle */}
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b transition-colors duration-500 ${
            isDarkMode ? 'border-slate-900' : 'border-slate-200'
          }`}>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-2.5" id="menu">
                <span>Explore Menu</span>
                {menuItems.length > 0 && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {menuItems.length} items
                  </span>
                )}
              </h2>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Filter by category and add items to build your feast
              </p>
            </div>

            {/* Premium Theme Switcher */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`self-start sm:self-auto flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-all duration-300 text-xs font-bold ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-850 shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-md'
              }`}
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Loading / Error / Content states */}
          {loading && (
            <div className="py-20 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          
          {error && (
            <div className="py-10">
              <ErrorMessage message={error} />
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Sticky Category Tabs */}
              {categories.length > 0 && (
                <CategoryFilter
                  categories={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* Menu items grid */}
              {filteredItems.length > 0 ? (
                <motion.div 
                  key={selectedCategory}
                  variants={gridVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 pt-4"
                >
                  {filteredItems.map((item) => (
                    <motion.div key={item.id} variants={cardVariants}>
                      <MenuCard item={item} isDarkMode={isDarkMode} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  message={`No dishes available in the '${selectedCategory}' category right now. Expand your search to explore other choices!`}
                  actionLabel="View All Dishes"
                  onAction={() => setSelectedCategory('All')}
                />
              )}
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default MenuPage;
