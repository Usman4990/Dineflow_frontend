// AdminLayout.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutDashboard, Utensils, ClipboardList, LogOut, ArrowLeft, User, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

export const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/menu');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Menu Items',
      path: '/admin/menu',
      icon: Utensils,
    },
    {
      label: 'Orders Queue',
      path: '/admin/orders',
      icon: ClipboardList,
    },
    {
      label: 'Reports Overview',
      path: '/admin/reports',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex h-screen bg-[#070b13] text-slate-100 overflow-hidden relative">
      
      {/* Background ambient glow spots */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none z-0 animate-glow-drift" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0 animate-glow-drift" />

      {/* Sidebar - Floating glass panel */}
      <aside className="relative z-10 w-64 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl m-4 mr-0 rounded-3xl flex flex-col h-[calc(100vh-2rem)] flex-shrink-0 shadow-2xl shadow-black/40">
        
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60 space-x-3">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-base shadow-lg shadow-orange-500/25">
            DF
          </span>
          <span className="text-sm font-black text-white tracking-widest uppercase">
            DineFlow Admin
          </span>
        </div>

        {/* User Info Card */}
        <div className="p-4 mx-4 my-4 bg-slate-850/40 border border-slate-800/40 rounded-2xl flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-200 truncate">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-[9px] text-slate-500 font-extrabold capitalize">
              Role: {user?.role || 'admin'}
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative block"
              >
                <div
                  className={`flex items-center space-x-3 px-4 py-3.5 text-xs font-bold rounded-xl transition-colors duration-300 relative z-10 ${
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeAdminNavItem"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl -z-10 shadow-lg shadow-orange-500/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/60 space-y-2">
          <Link
            to="/menu"
            className="flex items-center space-x-2 px-4 py-2.5 text-[10px] font-bold text-slate-400 rounded-xl hover:bg-slate-800/40 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go to Customer Side</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2.5 text-[10px] font-bold text-red-400 rounded-xl hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden relative z-10">
        
        {/* Top Header bar */}
        <header className="h-16 border-b border-slate-900/50 flex items-center justify-between px-8 flex-shrink-0 bg-slate-950/30 backdrop-blur-md">
          <h1 className="text-sm font-black tracking-widest uppercase text-white">
            {navItems.find((n) => isActive(n.path))?.label || 'Admin Panel'}
          </h1>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            System Status: <span className="text-emerald-450 font-black">Online</span>
          </div>
        </header>

        {/* View content window */}
        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
