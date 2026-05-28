import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { FiUser, FiMail, FiLock, FiAward, FiShield } from 'react-icons/fi';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/user/profile', {
        fullName: formData.fullName,
        email: formData.email
      });
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success("Profile details updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile info");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await api.put('/user/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      if (response.data.success) {
        toast.success("Password updated successfully!");
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const badges = [
    { name: 'First Milestone', desc: 'Solved 10 problems', active: true, icon: '🏆' },
    { name: 'Streaker', desc: 'Maintained a 7-day streak', active: true, icon: '🔥' },
    { name: 'Medium Master', desc: 'Solved 50 Medium problems', active: false, icon: '⚔️' },
    { name: 'Contestant', desc: 'Participated in a contest', active: true, icon: '🏅' }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Account Settings & Profile</h1>
        <p className="text-xs sm:text-sm text-[var(--color-dark-300)] mt-1 font-medium">Update credentials, profile records, and check achievements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card Widget */}
        <div className="glass-card p-6 flex flex-col items-center text-center h-fit border border-white/10 shadow-lg shadow-black/10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-extrabold text-3xl mb-4 border border-white/10 shadow-xl shadow-[var(--color-primary)]/10">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h3 className="text-lg font-bold text-white leading-none">{user?.fullName}</h3>
          <p className="text-xs text-[var(--color-dark-300)] mt-2 font-semibold">@{user?.username}</p>
          
          <div className="flex items-center gap-1.5 mt-4 px-3.5 py-1 rounded-md bg-[var(--color-dark-900)] border border-[var(--color-dark-700)] text-[9px] uppercase tracking-wider font-extrabold text-[var(--color-dark-200)] shadow-inner">
            <FiShield className="text-[10px]" /> {user?.role === 'ADMIN' ? 'Administrator' : 'Standard Student'}
          </div>

          <div className="w-full mt-6 pt-5 border-t border-[var(--color-dark-700)]/50 space-y-3.5 text-left min-w-0">
            <div className="flex items-center gap-3 text-xs text-[var(--color-dark-300)] font-semibold min-w-0">
              <FiMail className="shrink-0 text-sm text-[var(--color-dark-400)]" /> 
              <span className="text-white truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--color-dark-300)] font-semibold min-w-0">
              <FiUser className="shrink-0 text-sm text-[var(--color-dark-400)]" /> 
              <span className="text-white">Active Solver Sector</span>
            </div>
          </div>
        </div>

        {/* Forms & Badges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="glass-card p-5 sm:p-6 border border-white/10 shadow-lg shadow-black/10">
            <h3 className="text-base font-extrabold text-white mb-6">Profile Details</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
                      <FiUser size={14} />
                    </div>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field pl-10" 
                      required
                      id="profile-fullname"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
                      <FiMail size={14} />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field pl-10" 
                      required
                      id="profile-email"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn-primary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer mt-2" 
                disabled={loading}
                id="profile-save-btn"
              >
                Save Details
              </button>
            </form>
          </div>

          {/* Security Credentials Password Form */}
          <div className="glass-card p-5 sm:p-6 border border-white/10 shadow-lg shadow-black/10">
            <h3 className="text-base font-extrabold text-white mb-6">Security & Password</h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
                      <FiLock size={14} />
                    </div>
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="input-field pl-10" 
                      placeholder="••••••••"
                      required
                      id="security-current-pass"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
                      <FiLock size={14} />
                    </div>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="input-field pl-10" 
                      placeholder="••••••••"
                      required
                      id="security-new-pass"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
                      <FiLock size={14} />
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input-field pl-10" 
                      placeholder="••••••••"
                      required
                      id="security-confirm-pass"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn-primary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer mt-2" 
                disabled={loading}
                id="security-save-btn"
              >
                Update Credentials
              </button>
            </form>
          </div>

          {/* Badges and Accomplishments Workspace */}
          <div className="glass-card p-5 sm:p-6 border border-white/10 shadow-lg shadow-black/10">
            <h3 className="text-base font-extrabold text-white mb-6">Badges & Accomplishments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                    badge.active 
                      ? 'bg-[var(--color-dark-900)] border-[var(--color-dark-700)]/70 shadow-sm' 
                      : 'bg-[var(--color-dark-900)]/40 border-[var(--color-dark-800)]/50 opacity-40 select-none'
                  }`}
                >
                  <div className="text-3xl shrink-0">{badge.icon}</div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-white text-xs sm:text-sm truncate">{badge.name}</h4>
                    <p className="text-[10px] text-[var(--color-dark-300)] font-semibold mt-1 truncate">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
