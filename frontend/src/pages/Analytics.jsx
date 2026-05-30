import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid 
} from 'recharts';
import { FiTrendingUp, FiActivity, FiStar, FiCheckCircle, FiPieChart, FiInbox } from 'react-icons/fi';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to load analytics dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-60 bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-80 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
          <div className="h-80 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
          <div className="lg:col-span-2 h-80 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
          <div className="lg:col-span-2 h-44 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
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
        <h3 className="text-lg font-bold text-white">Analytics Unavailable</h3>
        <p className="text-xs text-[var(--color-dark-300)] max-w-sm">Failed to synchronize performance metrics. Please verify your data solvers or retry.</p>
        <button onClick={() => window.location.reload()} className="btn-primary text-xs uppercase tracking-wider py-2.5">Reload Analytics</button>
      </div>
    );
  }

  // High-contrast, vibrant difficulty colors matching requirements
  const difficultyData = [
    { name: 'Easy', value: data.easySolved || 0, color: '#22C55E' },
    { name: 'Medium', value: data.mediumSolved || 0, color: '#FACC15' },
    { name: 'Hard', value: data.hardSolved || 0, color: '#EF4444' }
  ].filter(d => d.value > 0);

  const hasSolves = data.totalSolved > 0;
  const pieDataToUse = hasSolves ? difficultyData : [{ name: 'No Solved Problems', value: 1, color: '#334155' }];

  // Format topic distribution from dynamic backend map
  const topicStats = [
    { name: 'Arrays', count: data.topicWiseCount?.['Arrays'] || 0 },
    { name: 'Strings', count: data.topicWiseCount?.['Strings'] || 0 },
    { name: 'Trees', count: data.topicWiseCount?.['Trees'] || 0 },
    { name: 'Graphs', count: data.topicWiseCount?.['Graphs'] || 0 },
    { name: 'DP', count: (data.topicWiseCount?.['Dynamic Programming'] || 0) + (data.topicWiseCount?.['DP'] || 0) },
    { name: 'Other', count: Object.keys(data.topicWiseCount || {}).reduce((acc, key) => {
        if (!['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'DP'].includes(key)) {
          return acc + (data.topicWiseCount[key] || 0);
        }
        return acc;
      }, 0) }
  ];

  // Dynamic Platform Stats from backend map
  const platformStats = [
    { name: 'LeetCode', count: data.platformWiseCount?.['LEETCODE'] || 0, color: '#3B82F6' },
    { name: 'GFG', count: data.platformWiseCount?.['GFG'] || 0, color: '#22C55E' },
    { name: 'Codeforces', count: data.platformWiseCount?.['CODEFORCES'] || 0, color: '#8B5CF6' },
    { name: 'Other', count: Object.keys(data.platformWiseCount || {}).reduce((acc, key) => {
        if (!['LEETCODE', 'GFG', 'CODEFORCES'].includes(key)) {
          return acc + (data.platformWiseCount[key] || 0);
        }
        return acc;
      }, 0), color: '#06B6D4' }
  ];

  const totalPlatformProblems = platformStats.reduce((acc, p) => acc + p.count, 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-xs sm:text-sm text-[var(--color-dark-300)] mt-1 font-semibold">Detailed breakdown of difficulty levels, topic structures, and solved metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Pie Chart */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between min-w-0 shadow-lg">
          <div>
            <h3 className="text-base font-extrabold text-white">Difficulty Distribution</h3>
            <p className="text-xs text-[var(--color-dark-300)] mt-0.5 font-semibold">Vibrant, high-contrast difficulty classification</p>
          </div>
          <div className="h-64 relative flex items-center justify-center mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDataToUse}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieDataToUse.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--color-dark-800)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => name === 'No Solved Problems' ? [0, 'Solved'] : [value, 'Solved']}
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
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-extrabold text-[var(--color-dark-300)] hover:text-white transition-colors">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Breakdown Bar Chart */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between min-w-0 shadow-lg">
          <div>
            <h3 className="text-base font-extrabold text-white">Topic Distribution</h3>
            <p className="text-xs text-[var(--color-dark-300)] mt-0.5 font-semibold">Solves catalogued by DSA categories</p>
          </div>
          <div className="h-64 mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicStats} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-dark-700)" horizontal={false} />
                <XAxis 
                  type="number" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-dark-300)', fontSize: 12, fontWeight: 700 }} 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
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
                <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend Area Chart */}
        <div className="glass-card p-5 sm:p-6 flex flex-col justify-between min-w-0 lg:col-span-2 shadow-lg">
          <div>
            <h3 className="text-base font-extrabold text-white">Activity Trend</h3>
            <p className="text-xs text-[var(--color-dark-300)] mt-0.5 font-semibold">Solved problems consistency trend this week</p>
          </div>
          <div className="h-64 mt-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weeklyData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-dark-700)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-dark-300)', fontSize: 12, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-dark-300)', fontSize: 12, fontWeight: 700 }} 
                />
                <Tooltip 
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
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3} 
                  activeDot={{ r: 7, stroke: 'var(--color-primary-light)', strokeWidth: 2 }} 
                  dot={{ r: 5, fill: 'var(--color-dark-800)', stroke: 'var(--color-primary-light)', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share progress indicators */}
        <div className="glass-card p-5 sm:p-6 lg:col-span-2 shadow-lg">
          <div className="mb-6">
            <h3 className="text-base font-extrabold text-white">Platform Allocation</h3>
            <p className="text-xs text-[var(--color-dark-300)] mt-0.5 font-semibold">High-contrast distribution matching online judges</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {platformStats.map((p, idx) => {
              const solvedPct = Math.round((p.count / Math.max(1, totalPlatformProblems)) * 100);
              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-[var(--color-dark-900)] border border-[var(--color-dark-700)] hover:border-[var(--color-primary)] transition-all flex flex-col justify-between h-28 group"
                >
                  <span className="text-[10px] text-[var(--color-dark-300)] font-extrabold uppercase tracking-wider">{p.name}</span>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-2xl font-extrabold text-white leading-none">{p.count}</span>
                    <span className="text-[10px] font-bold text-[var(--color-dark-300)] uppercase leading-none">solved ({solvedPct}%)</span>
                  </div>
                  {/* High contrast track and progress color bar */}
                  <div className="w-full bg-[var(--color-dark-700)] h-2 rounded-full overflow-hidden mt-3 shadow-inner border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${solvedPct}%`, backgroundColor: p.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
