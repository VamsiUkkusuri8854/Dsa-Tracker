import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiTrendingUp, FiCheckCircle, FiActivity, FiStar, FiCalendar, FiInbox } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-12 w-32 bg-slate-800 rounded-lg"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
          ))}
        </div>

        {/* Graphs Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
          <div className="h-80 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
          <FiInbox size={32} />
        </div>
        <h3 className="text-lg font-bold text-white">Metrics Unavailable</h3>
        <p className="text-xs text-[var(--color-dark-300)] max-w-sm">We encountered an issue retrieving your learning performance metrics. Please reload the page or sign in again.</p>
        <button onClick={() => window.location.reload()} className="btn-primary text-xs uppercase tracking-wider py-2.5">Retry Sync</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Upper header segment */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-xs sm:text-sm text-[var(--color-dark-300)] mt-1 font-semibold">Keep solving, keep learning, keep growing.</p>
        </div>
        <div className="flex items-center gap-3 bg-[var(--color-dark-800)] px-4 py-2.5 rounded-2xl border border-[var(--color-dark-700)] shadow-lg">
          <div className="text-yellow-500 text-2xl">🔥</div>
          <div>
            <div className="text-[9px] text-[var(--color-dark-300)] font-extrabold uppercase tracking-wider leading-none">Current Streak</div>
            <div className="text-base font-extrabold text-white mt-1 leading-none">{data.currentStreak} Days</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Solved Card */}
        <div className="stat-card group relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[var(--color-dark-300)] uppercase tracking-wider mb-2">Total Solved</p>
              <h3 className="text-3xl font-extrabold text-white group-hover:text-[var(--color-primary-light)] transition-colors">{data.totalSolved}</h3>
            </div>
            <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] rounded-xl border border-[var(--color-primary)]/20"><FiActivity size={20} /></div>
          </div>
        </div>
        
        {/* Easy Solved Card */}
        <div className="stat-card relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[var(--color-dark-300)] uppercase tracking-wider mb-2">Easy solved</p>
              <h3 className="text-3xl font-extrabold text-[var(--color-easy)]">{data.easySolved}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><FiCheckCircle size={20} /></div>
          </div>
        </div>

        {/* Medium Solved Card */}
        <div className="stat-card relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[var(--color-dark-300)] uppercase tracking-wider mb-2">Medium solved</p>
              <h3 className="text-3xl font-extrabold text-[var(--color-medium)]">{data.mediumSolved}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><FiTrendingUp size={20} /></div>
          </div>
        </div>

        {/* Hard Solved Card */}
        <div className="stat-card relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-[var(--color-dark-300)] uppercase tracking-wider mb-2">Hard solved</p>
              <h3 className="text-3xl font-extrabold text-[var(--color-hard)]">{data.hardSolved}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20"><FiStar size={20} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart Card with high-contrast ticks, grid lines, and tooltips */}
        <div className="lg:col-span-2 glass-card p-5 sm:p-6 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-base font-extrabold text-white">Weekly Consistency</h3>
            <p className="text-xs text-[var(--color-dark-300)] mt-0.5 font-semibold">Tracking problems solved per day this week</p>
          </div>
          <div className="h-64 mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-dark-700)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-dark-300)', fontSize: 12, fontWeight: 700 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-dark-300)', fontSize: 12, fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-dark-800)', 
                    border: '2px solid var(--color-dark-700)', 
                    borderRadius: '12px', 
                    color: '#ffffff', 
                    fontSize: '12px', 
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700 
                  }}
                />
                <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                  {data.weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? 'url(#primaryGrad)' : 'var(--color-dark-700)'} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary-light)" />
                    <stop offset="100%" stopColor="var(--color-primary)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Recent Activity</h3>
            <p className="text-xs text-[var(--color-dark-300)] mt-0.5 font-semibold">Your latest completed exercises</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 mt-6 custom-scrollbar space-y-3 max-h-[250px] min-w-0">
            {data.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-dark-900)] border border-[var(--color-dark-700)] hover:border-[var(--color-primary)] transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      activity.difficulty === 'EASY' ? 'bg-[var(--color-easy)] shadow-md shadow-emerald-500/50' : 
                      activity.difficulty === 'MEDIUM' ? 'bg-[var(--color-medium)] shadow-md shadow-yellow-500/50' : 'bg-[var(--color-hard)] shadow-md shadow-red-500/50'
                    }`}></div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[var(--color-primary-light)] transition-colors">{activity.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-[var(--color-dark-300)] uppercase font-extrabold">{activity.platform}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="text-[9px] text-[var(--color-dark-300)] truncate font-bold">{activity.topic}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-dark-300)] shrink-0 flex items-center gap-1">
                    <FiCalendar /> solved
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center space-y-3">
                <FiInbox className="text-[var(--color-dark-500)]" size={28} />
                <div>
                  <p className="text-xs font-bold text-white">No solves logged</p>
                  <p className="text-[10px] text-[var(--color-dark-300)] mt-0.5">Solve recommended problems to populate list.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
