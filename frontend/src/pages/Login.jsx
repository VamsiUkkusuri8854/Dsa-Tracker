import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(formData);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 shadow-2xl relative border border-white/10 rounded-2xl overflow-hidden">
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
      
      <h2 className="text-2xl font-extrabold text-white mb-2 text-center tracking-tight">Welcome Back</h2>
      <p className="text-xs text-[var(--color-dark-300)] text-center mb-6 font-medium">Please sign in to access your coding tracker</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username field */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-dark-400)]">
              <FiMail className="text-sm" />
            </div>
            <input 
              type="text" 
              className="input-field pl-10" 
              placeholder="e.g. vamsi"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              id="login-username-input"
            />
          </div>
        </div>
        
        {/* Password field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider">Password</label>
            <a href="#" className="text-xs font-semibold text-[var(--color-primary-light)] hover:text-white transition-colors">Forgot password?</a>
          </div>
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
              id="login-password-input"
            />
          </div>
        </div>
        
        {/* Submit button */}
        <button 
          type="submit" 
          className="btn-primary w-full justify-center mt-6 py-3 text-xs tracking-wider uppercase font-extrabold cursor-pointer" 
          disabled={loading}
          id="login-submit-btn"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 pt-4 border-t border-[var(--color-dark-700)] text-center">
        <p className="text-xs text-[var(--color-dark-300)] font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary-light)] hover:text-white font-bold transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
