import React, { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-[var(--color-dark-800)]/70 backdrop-blur-md border-b border-[var(--color-dark-700)]/40 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-all">
      {/* Search and Navigation toggle trigger */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/50 rounded-xl transition-colors cursor-pointer"
          aria-label="Open sidebar"
          id="sidebar-toggle-btn"
        >
          <FiMenu size={20} />
        </button>
        
        {/* Professional Search bar matching LeetCode / Notion */}
        <div className="hidden md:flex items-center gap-2.5 bg-[var(--color-dark-900)] px-3.5 py-2 rounded-xl border border-[var(--color-dark-600)] focus-within:border-[var(--color-primary-light)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all w-72 shadow-inner">
          <FiSearch className="text-[var(--color-dark-400)] text-base" />
          <input 
            type="text" 
            placeholder="Search problems or concepts..." 
            className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-[var(--color-dark-400)] font-medium"
            id="global-search-input"
          />
        </div>
      </div>

      {/* Action Controls & Profile Settings */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Switcher button */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[var(--color-dark-600)]"
          title="Toggle system theme"
          id="theme-toggle-btn"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        
        {/* Notifications Icon with animated glow pulse */}
        <button 
          className="p-2.5 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/50 rounded-xl transition-colors relative cursor-pointer border border-transparent hover:border-[var(--color-dark-600)]"
          title="Alert notification desk"
          id="notifications-btn"
        >
          <FiBell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50"></span>
        </button>

        {/* Profile Dropdown panel */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-[var(--color-dark-700)]/50 p-1 rounded-full transition-all border border-transparent hover:border-[var(--color-dark-600)] cursor-pointer"
            id="profile-dropdown-trigger"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[var(--color-primary)]/20">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay screen to dismiss list dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
              
              <div className="absolute right-0 mt-3 w-52 bg-[var(--color-dark-800)] rounded-2xl shadow-2xl border border-[var(--color-dark-600)] z-50 overflow-hidden animate-slide-up">
                <div className="px-4 py-3.5 border-b border-[var(--color-dark-700)] bg-[var(--color-dark-900)]/50">
                  <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                  <p className="text-xs text-[var(--color-dark-300)] truncate mt-0.5 font-medium">{user?.email}</p>
                </div>
                <div className="py-1.5 p-1">
                  <Link 
                    to="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl text-[var(--color-dark-200)] hover:bg-[var(--color-dark-700)]/60 hover:text-white transition-colors"
                  >
                    <FiUser size={15} /> Edit Profile
                  </Link>
                  <button 
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left transition-colors cursor-pointer mt-0.5"
                  >
                    <FiLogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
