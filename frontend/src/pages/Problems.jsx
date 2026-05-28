import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, 
  FiExternalLink, FiStar, FiCheck, FiRefreshCw, FiAlertCircle, FiInbox 
} from 'react-icons/fi';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    platform: '',
    topic: '',
    revisionNeeded: false
  });
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    problemName: '',
    platform: 'LEETCODE',
    difficulty: 'EASY',
    topic: 'Arrays',
    tags: '',
    dateSolved: new Date().toISOString().split('T')[0],
    timeTaken: 30,
    notes: '',
    problemLink: '',
    revisionNeeded: false,
    status: 'SOLVED'
  });

  const topics = [
    'Arrays', 'Strings', 'Linked Lists', 'Trees', 
    'Graphs', 'Dynamic Programming', 'Recursion', 
    'Greedy', 'Backtracking'
  ];

  const fetchProblems = async () => {
    setLoading(true);
    try {
      let url = '/problems';
      const response = await api.get(url, {
        params: {
          size: 100, 
        }
      });
      if (response.data.success) {
        setProblems(response.data.data.content || []);
      }
    } catch (error) {
      console.error("Failed to load problems", error);
      toast.error("Failed to retrieve problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOpenAdd = () => {
    setEditingProblem(null);
    setFormData({
      problemName: '',
      platform: 'LEETCODE',
      difficulty: 'EASY',
      topic: 'Arrays',
      tags: '',
      dateSolved: new Date().toISOString().split('T')[0],
      timeTaken: 30,
      notes: '',
      problemLink: '',
      revisionNeeded: false,
      status: 'SOLVED'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (problem) => {
    setEditingProblem(problem);
    const isUnsolved = problem.status === 'UNSOLVED';
    setFormData({
      problemName: problem.problemName,
      platform: problem.platform,
      difficulty: problem.difficulty,
      topic: problem.topic,
      tags: problem.tags ? problem.tags.join(', ') : '',
      dateSolved: isUnsolved ? new Date().toISOString().split('T')[0] : (problem.dateSolved || ''),
      timeTaken: isUnsolved ? 30 : (problem.timeTaken || 30),
      notes: problem.notes || '',
      problemLink: problem.problemLink || '',
      revisionNeeded: problem.revisionNeeded || false,
      status: isUnsolved ? 'SOLVED' : (problem.status || 'SOLVED')
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    };

    try {
      if (editingProblem) {
        await api.put(`/problems/${editingProblem.id}`, payload);
        toast.success("Problem updated successfully!");
      } else {
        await api.post('/problems', payload);
        toast.success("Problem added successfully!");
      }
      setShowAddModal(false);
      fetchProblems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save problem");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem entry?")) return;
    try {
      await api.delete(`/problems/${id}`);
      toast.success("Problem entry removed");
      fetchProblems();
    } catch (error) {
      toast.error("Failed to delete problem");
    }
  };

  const handleToggleBookmark = async (problemId) => {
    try {
      await api.post(`/user/bookmark/${problemId}`);
      toast.success("Bookmark state updated");
      fetchProblems();
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  // Client-side filtering
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.problemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filters.difficulty || p.difficulty === filters.difficulty;
    const matchesPlatform = !filters.platform || p.platform === filters.platform;
    const matchesTopic = !filters.topic || p.topic === filters.topic;
    const matchesRevision = !filters.revisionNeeded || p.revisionNeeded === true;

    return matchesSearch && matchesDifficulty && matchesPlatform && matchesTopic && matchesRevision;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">DSA Problems Workspace</h1>
          <p className="text-xs sm:text-sm text-[var(--color-dark-300)] mt-1 font-medium">Manage and review your algorithmic solves efficiently.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="btn-primary w-full sm:w-auto uppercase tracking-wider text-xs font-bold py-3"
          id="add-problem-workspace-btn"
        >
          <FiPlus size={18} /> Add Solved Problem
        </button>
      </div>

      {/* Advanced Filter grid */}
      <div className="glass-card p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end shadow-lg shadow-black/10">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider mb-2">Search Problems</label>
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3.5 text-[var(--color-dark-400)] text-sm" />
            <input 
              type="text" 
              placeholder="Search by name, topic..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              id="problem-search-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider mb-2">Difficulty</label>
          <select 
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            className="input-field cursor-pointer"
            id="difficulty-filter-select"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider mb-2">Topic Group</label>
          <select 
            value={filters.topic}
            onChange={(e) => setFilters({...filters, topic: e.target.value})}
            className="input-field cursor-pointer"
            id="topic-filter-select"
          >
            <option value="">All Topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2.5 pb-3">
          <input 
            type="checkbox" 
            id="revisionFilter"
            checked={filters.revisionNeeded}
            onChange={(e) => setFilters({...filters, revisionNeeded: e.target.checked})}
            className="w-4 h-4 rounded text-[var(--color-primary)] bg-[var(--color-dark-900)] border-[var(--color-dark-600)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="revisionFilter" className="text-xs font-bold text-[var(--color-dark-200)] cursor-pointer select-none">Revision Required</label>
        </div>
      </div>

      {/* Problems Table container */}
      <div className="glass-card overflow-hidden shadow-xl shadow-black/15">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-[var(--color-dark-700)] bg-[var(--color-dark-900)]/60">
                <th className="p-4 text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider w-[40%]">Problem Name</th>
                <th className="p-4 text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider">Platform</th>
                <th className="p-4 text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider">Difficulty</th>
                <th className="p-4 text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider">Topic</th>
                <th className="p-4 text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider">Time Taken</th>
                <th className="p-4 text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider">Solved Date</th>
                <th className="p-4 text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-700)]/50">
              {loading ? (
                // Shimmer Row skeleton loaders
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-48"></div></td>
                    <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-5 bg-zinc-800 rounded-full w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                    <td className="p-4 text-right pr-6"><div className="h-8 bg-zinc-800 rounded-lg w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <tr key={problem.id} className="hover:bg-[var(--color-dark-900)]/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleBookmark(problem.id)}
                          className={`transition-colors cursor-pointer ${
                            problem.bookmarked ? 'text-amber-500 hover:text-amber-600' : 'text-[var(--color-dark-400)] hover:text-amber-400'
                          }`}
                          title="Bookmark this problem"
                        >
                          <FiStar size={16} fill={problem.bookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <span className={`truncate max-w-xs ${
                          problem.status === 'UNSOLVED' ? 'text-zinc-400 font-medium' : 'font-bold text-white'
                        }`}>{problem.problemName}</span>
                        {problem.status === 'UNSOLVED' && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[8px] font-extrabold uppercase border border-zinc-700">Unsolved</span>
                        )}
                        {problem.revisionNeeded && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-[8px] font-extrabold uppercase border border-rose-500/20">Revision</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[var(--color-dark-200)] font-bold">{problem.platform}</td>
                    <td className="p-4">
                      <span className={`tag ${
                        problem.difficulty === 'EASY' ? 'tag-easy' : 
                        problem.difficulty === 'MEDIUM' ? 'tag-medium' : 'tag-hard'
                      } ${problem.status === 'UNSOLVED' ? 'opacity-40' : ''}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[var(--color-dark-200)] font-medium">{problem.topic}</td>
                    <td className="p-4 text-xs text-white font-bold">
                      {problem.status === 'UNSOLVED' ? (
                        <span className="text-[var(--color-dark-500)]">-</span>
                      ) : (
                        `${problem.timeTaken} min`
                      )}
                    </td>
                    <td className="p-4 text-xs text-[var(--color-dark-300)] font-medium">
                      {problem.status === 'UNSOLVED' ? (
                        <span className="text-[var(--color-dark-500)]">-</span>
                      ) : (
                        problem.dateSolved
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                        {problem.problemLink && (
                          <a 
                            href={problem.problemLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/60 rounded-xl transition-all border border-transparent hover:border-[var(--color-dark-600)]"
                            title="Visit problem link"
                          >
                            <FiExternalLink size={14} />
                          </a>
                        )}
                        {problem.status === 'UNSOLVED' ? (
                          <button 
                            onClick={() => handleOpenEdit(problem)}
                            className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-500/20 cursor-pointer"
                            title="Mark as Solved"
                          >
                            <FiCheck size={14} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenEdit(problem)}
                            className="p-2 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/60 rounded-xl transition-all border border-transparent hover:border-[var(--color-dark-600)] cursor-pointer"
                            title="Edit this entry"
                          >
                            <FiEdit2 size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(problem.id)}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
                          title="Delete this entry"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
                      <FiInbox className="text-[var(--color-dark-500)]" size={36} />
                      <div>
                        <p className="text-sm font-bold text-white">No Matching Solves Found</p>
                        <p className="text-xs text-[var(--color-dark-300)] mt-0.5">Try adjusting your filters or adding a new solved entry.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-white">
                {editingProblem ? (editingProblem.status === 'UNSOLVED' ? 'Complete Preset Problem' : 'Edit Solved Entry') : 'Log Solved Problem'}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Problem Name</label>
                  <input 
                    type="text" 
                    name="problemName"
                    value={formData.problemName}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="e.g. 3Sum Closest"
                    required
                    id="modal-problem-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Platform</label>
                  <select 
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    id="modal-platform"
                  >
                    <option value="LEETCODE">LeetCode</option>
                    <option value="GFG">GeeksforGeeks</option>
                    <option value="CODECHEF">CodeChef</option>
                    <option value="CODEFORCES">Codeforces</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Difficulty</label>
                  <select 
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    id="modal-difficulty"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    id="modal-status"
                  >
                    <option value="SOLVED">Solved</option>
                    <option value="ATTEMPTED">Attempted</option>
                    <option value="REVISIT">Revisit</option>
                    <option value="UNSOLVED">Unsolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Topic Group</label>
                  <select 
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    id="modal-topic"
                  >
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Time Taken (minutes)</label>
                  <input 
                    type="number" 
                    name="timeTaken"
                    value={formData.timeTaken}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="e.g. 30"
                    min="1"
                    required
                    id="modal-time-taken"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Problem URL Link</label>
                  <input 
                    type="url" 
                    name="problemLink"
                    value={formData.problemLink}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="https://leetcode.com/problems/..."
                    id="modal-problem-link"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                  <input 
                    type="text" 
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="e.g. hash-table, two-pointers"
                    id="modal-tags"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Review Summary Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field h-24 resize-none custom-scrollbar" 
                    placeholder="Add algorithmic approaches, time complexities, corner cases..."
                    id="modal-notes"
                  />
                </div>

                <div className="flex items-center gap-2.5 pb-2">
                  <input 
                    type="checkbox" 
                    name="revisionNeeded"
                    id="modal-revision-needed"
                    checked={formData.revisionNeeded}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-[var(--color-primary)] bg-[var(--color-dark-900)] border-[var(--color-dark-600)] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="modal-revision-needed" className="text-xs font-bold text-[var(--color-dark-200)] cursor-pointer select-none">Mark for Revision</label>
                </div>
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
                  id="modal-save-btn"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problems;
