import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiAward, FiCalendar, FiClock, FiTrendingUp, FiInbox } from 'react-icons/fi';

const ContestTracker = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    contestName: '',
    platform: 'LEETCODE',
    contestDate: new Date().toISOString().split('T')[0],
    problemsSolved: 2,
    totalProblems: 4,
    globalRank: 1200,
    ratingChange: 15,
    notes: ''
  });

  const fetchContests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contests');
      if (response.data.success) {
        setContests(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load contests", error);
      toast.error("Failed to retrieve contest records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contests', formData);
      toast.success("Contest participation recorded!");
      setShowAddModal(false);
      fetchContests();
    } catch (error) {
      toast.error("Failed to save contest entry");
    }
  };

  const upcomingContests = [
    { name: 'Weekly Contest 401', platform: 'LeetCode', date: 'Sunday, 8:00 AM', link: 'https://leetcode.com/contest/' },
    { name: 'Biweekly Contest 134', platform: 'LeetCode', date: 'Saturday, 8:00 PM', link: 'https://leetcode.com/contest/' },
    { name: 'Codeforces Round 950 (Div. 2)', platform: 'Codeforces', date: 'Wednesday, 8:05 PM', link: 'https://codeforces.com/contests' }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Contests & Competitions</h1>
          <p className="text-xs sm:text-sm text-[var(--color-dark-300)] mt-1 font-medium">Track your competitive programming logs, ranks, and rating changes.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary w-full sm:w-auto uppercase tracking-wider text-xs font-bold py-3 cursor-pointer"
          id="log-contest-btn"
        >
          <FiPlus size={18} /> Log Contest Performance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Past Participations history */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-extrabold text-white">Participation History</h3>

          {loading ? (
            // Row Loading skeleton
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-zinc-800 rounded-2xl border border-zinc-700/30 animate-pulse"></div>
              ))}
            </div>
          ) : contests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {contests.map((contest) => (
                <div 
                  key={contest.id} 
                  className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-white/10"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex text-[9px] uppercase font-extrabold text-[var(--color-accent-light)] bg-[var(--color-accent)]/10 px-2.5 py-0.5 rounded-md border border-[var(--color-accent)]/20 leading-none">
                        {contest.platform}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--color-dark-300)] uppercase leading-none">{contest.contestDate}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-white mt-3 truncate">{contest.contestName}</h4>
                    <p className="text-xs text-[var(--color-dark-300)] mt-1.5 font-medium leading-relaxed max-w-md">{contest.notes || 'No review notes compiled for this round.'}</p>
                  </div>

                  {/* Rank grids */}
                  <div className="flex flex-wrap items-center gap-6 shrink-0 pt-2 sm:pt-0">
                    <div className="text-center sm:text-right">
                      <div className="text-[9px] text-[var(--color-dark-400)] uppercase font-extrabold tracking-wider leading-none">Global Rank</div>
                      <div className="text-sm sm:text-base font-extrabold text-white mt-1.5 leading-none">#{contest.globalRank}</div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="text-[9px] text-[var(--color-dark-400)] uppercase font-extrabold tracking-wider leading-none">Solved Problems</div>
                      <div className="text-sm sm:text-base font-extrabold text-[var(--color-primary-light)] mt-1.5 leading-none">
                        {contest.problemsSolved} / {contest.totalProblems}
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="text-[9px] text-[var(--color-dark-400)] uppercase font-extrabold tracking-wider leading-none">Rating Adjust</div>
                      <div className={`text-sm sm:text-base font-extrabold flex items-center justify-center gap-0.5 mt-1.5 leading-none ${contest.ratingChange >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-hard)]'}`}>
                        {contest.ratingChange >= 0 ? `+${contest.ratingChange}` : contest.ratingChange}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-3">
              <FiInbox className="text-[var(--color-dark-500)]" size={36} />
              <div>
                <p className="text-sm font-bold text-white">No Participations Logged</p>
                <p className="text-xs text-[var(--color-dark-300)] mt-0.5">Keep track of your performance stats by logging your contest records.</p>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Contests */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-white">Upcoming Contests</h3>
          <div className="grid grid-cols-1 gap-4">
            {upcomingContests.map((uc, index) => (
              <div 
                key={index} 
                className="glass-card p-5 border-l-4 border-[var(--color-primary)] border-y-white/10 border-r-white/10 shadow-md shadow-black/5"
              >
                <div className="flex justify-between items-center">
                  <span className="inline-flex text-[9px] font-extrabold bg-[var(--color-dark-900)] text-[var(--color-dark-200)] px-2.5 py-0.5 rounded-md uppercase border border-[var(--color-dark-700)]">
                    {uc.platform}
                  </span>
                  <a 
                    href={uc.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] text-[var(--color-primary-light)] hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    Go Register <FiClock />
                  </a>
                </div>
                <h4 className="font-extrabold text-white text-sm sm:text-base mt-3 leading-snug">{uc.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-dark-300)] font-medium mt-3 leading-none">
                  <FiCalendar size={13} /> {uc.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Contest modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-white">Log Contest Performance</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Contest Name</label>
                <input 
                  type="text" 
                  name="contestName"
                  value={formData.contestName}
                  onChange={handleInputChange}
                  className="input-field" 
                  placeholder="e.g. Codeforces Round 954 (Div. 3)"
                  required
                  id="modal-contest-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Platform</label>
                  <select 
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    id="modal-contest-platform"
                  >
                    <option value="LEETCODE">LeetCode</option>
                    <option value="CODEFORCES">Codeforces</option>
                    <option value="CODECHEF">CodeChef</option>
                    <option value="GFG">GeeksforGeeks</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Date solved</label>
                  <input 
                    type="date" 
                    name="contestDate"
                    value={formData.contestDate}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    required
                    id="modal-contest-date"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Problems Solved</label>
                  <input 
                    type="number" 
                    name="problemsSolved"
                    value={formData.problemsSolved}
                    onChange={handleInputChange}
                    className="input-field" 
                    min="0"
                    required
                    id="modal-contest-solved"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Total Problems</label>
                  <input 
                    type="number" 
                    name="totalProblems"
                    value={formData.totalProblems}
                    onChange={handleInputChange}
                    className="input-field" 
                    min="1"
                    required
                    id="modal-contest-total"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Global Rank</label>
                  <input 
                    type="number" 
                    name="globalRank"
                    value={formData.globalRank}
                    onChange={handleInputChange}
                    className="input-field" 
                    min="1"
                    required
                    id="modal-contest-rank"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Rating Change</label>
                  <input 
                    type="number" 
                    name="ratingChange"
                    value={formData.ratingChange}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="e.g. 24 or -10"
                    required
                    id="modal-contest-rating"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Notes & Review Summary</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="input-field h-24 resize-none custom-scrollbar" 
                  placeholder="Which problems did you struggle with? Complexities analyzed?"
                  id="modal-contest-notes"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-dark-700)]">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  id="modal-contest-save"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestTracker;
