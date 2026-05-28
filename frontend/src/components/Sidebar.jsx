import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiCode, FiPieChart, FiMap, 
  FiFileText, FiAward, FiSettings, FiX 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Problems', path: '/problems', icon: <FiCode /> },
    { name: 'Analytics', path: '/analytics', icon: <FiPieChart /> },
    { name: 'Roadmap', path: '/roadmap', icon: <FiMap /> },
    { name: 'Notes', path: '/notes', icon: <FiFileText /> },
    { name: 'Contests', path: '/contests', icon: <FiAward /> },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: <FiSettings /> });
  }

  return (
    <div className="w-64 h-screen bg-[var(--color-dark-800)] border-r border-[var(--color-dark-700)]/40 flex flex-col z-50">
      {/* Brand title bar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-dark-700)]/40">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>⚡</span>
          <span>
            Smart <span className="gradient-text">DSA</span>
          </span>
        </h2>
        <button 
          className="lg:hidden p-1.5 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/50 rounded-lg transition-colors cursor-pointer" 
          onClick={onClose}
          aria-label="Close sidebar"
          id="close-sidebar-btn"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Navigation link container */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            id={`sidebar-link-${item.name.toLowerCase().replace(' ', '-')}`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="font-semibold text-xs tracking-wide uppercase">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom User Card workspace */}
      <div className="p-4 border-t border-[var(--color-dark-700)]/40 bg-[var(--color-dark-900)]/20">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-dark-900)] border border-[var(--color-dark-700)]/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-[var(--color-primary)]/10">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
            <p className="text-[10px] text-[var(--color-dark-400)] font-semibold truncate mt-0.5">@{user?.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
