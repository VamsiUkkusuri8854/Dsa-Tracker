import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

const AuthLayout = () => {
  const { token } = useAuth();

  // If already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-dark-950)]">
      {/* Premium ambient light glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-600 opacity-25 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-cyan-500 opacity-20 blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[35%] w-[300px] h-[300px] rounded-full bg-purple-600 opacity-10 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 shadow-lg shadow-indigo-500/5">
            <span className="text-2xl font-bold text-indigo-400">🔥</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Smart <span className="gradient-text">DSA Tracker</span>
          </h1>
          <p className="text-[var(--color-dark-300)] mt-1.5 text-sm font-medium">Elevate your problem-solving efficiency.</p>
        </div>
        
        <Outlet />
      </div>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--color-dark-800)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
};

export default AuthLayout;
