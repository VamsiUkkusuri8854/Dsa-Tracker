import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(formData);
    setLoading(false);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 shadow-2xl relative border border-white/10 rounded-2xl overflow-hidden">
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
      
      <h2 className="text-2xl font-extrabold text-white mb-2 text-center tracking-tight">Create Account</h2>
      <p className="text-xs text-[var(--color-dark-300)] text-center mb-6 font-medium">Join us and start mastering your DSA roadmaps</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name field */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
              <FiUser className="text-sm" />
            </div>
            <input 
              type="text" 
              className="input-field pl-10" 
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
              id="register-fullname-input"
            />
          </div>
        </div>

        {/* Username field */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
              <FiUser className="text-sm" />
            </div>
            <input 
              type="text" 
              className="input-field pl-10" 
              placeholder="e.g. johndoe"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              id="register-username-input"
            />
          </div>
        </div>
        
        {/* Email field */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
              <FiMail className="text-sm" />
            </div>
            <input 
              type="email" 
              className="input-field pl-10" 
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              id="register-email-input"
            />
          </div>
        </div>
        
        {/* Password field */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
              <FiLock className="text-sm" />
            </div>
            <input 
              type="password" 
              className="input-field pl-10" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
              minLength={6}
              id="register-password-input"
            />
          </div>
        </div>
        
        {/* Submit button */}
        <button 
          type="submit" 
          className="btn-primary w-full justify-center mt-6 py-3 text-xs tracking-wider uppercase font-extrabold cursor-pointer" 
          disabled={loading}
          id="register-submit-btn"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-6 pt-4 border-t border-[var(--color-dark-700)] text-center">
        <p className="text-xs text-[var(--color-dark-300)] font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary-light)] hover:text-white font-bold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
