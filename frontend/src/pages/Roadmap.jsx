import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { FiChevronDown, FiChevronUp, FiCheckCircle, FiCircle, FiExternalLink, FiAward, FiInbox } from 'react-icons/fi';

const Roadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [userProblems, setUserProblems] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const roadmapResponse = await api.get('/roadmaps/progress');
      const problemsResponse = await api.get('/problems', { params: { size: 500 } });
      
      if (roadmapResponse.data.success) {
        setRoadmaps(roadmapResponse.data.data || []);
      }
      if (problemsResponse.data.success) {
        setUserProblems(problemsResponse.data.data.content || []);
      }
    } catch (error) {
      console.error("Failed to load roadmap data", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTopicExpand = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const isProblemSolved = (problemName) => {
    return userProblems.some(p => p.problemName.toLowerCase() === problemName.toLowerCase());
  };

  const handleMarkSolved = async (problem, topic) => {
    const isAlreadySolved = isProblemSolved(problem.name);
    if (isAlreadySolved) {
      toast.error("Problem already marked as solved");
      return;
    }

    try {
      const payload = {
        problemName: problem.name,
        platform: problem.platform.toUpperCase() === 'LEETCODE' ? 'LEETCODE' : 'OTHER',
        difficulty: problem.difficulty,
        topic: topic,
        dateSolved: new Date().toISOString().split('T')[0],
        timeTaken: 30,
        notes: `Recommended problem from ${topic} roadmap.`,
        problemLink: problem.link,
        revisionNeeded: false,
        status: 'SOLVED'
      };

      await api.post('/problems', payload);
      toast.success(`Completed: ${problem.name}!`);
      fetchData(); 
    } catch (error) {
      toast.error("Failed to mark problem as solved");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-80 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-2xl border border-slate-700/30"></div>
          ))}
        </div>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-3">
        <FiInbox className="text-[var(--color-dark-500)]" size={36} />
        <div>
          <p className="text-sm font-bold text-white">No Roadmaps Found</p>
          <p className="text-xs text-[var(--color-dark-300)] mt-0.5">Please check with your administrator or initialize system trackers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Structured Learning Roadmaps</h1>
        <p className="text-xs sm:text-sm text-[var(--color-dark-300)] mt-1 font-semibold">Follow structured learning checkpoints and track your subject matter mastery progress.</p>
      </div>

      <div className="space-y-4">
        {roadmaps.map(({ roadmap, solved, percentage }) => {
          const isExpanded = expandedTopic === roadmap.id;
          const isMastered = percentage === 100;
          
          return (
            <div key={roadmap.id} className="glass-card overflow-hidden shadow-lg">
              {/* Checkpoint row trigger */}
              <div 
                onClick={() => toggleTopicExpand(roadmap.id)}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[var(--color-dark-900)]/30 transition-all select-none"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base sm:text-lg font-extrabold text-white leading-none">{roadmap.topic}</h3>
                    {isMastered && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-[var(--color-success)] bg-emerald-500/10 px-2.5 py-0.5 rounded-md font-extrabold uppercase border border-emerald-500/20 shadow-sm leading-none mt-0.5">
                        <FiAward size={10} className="shrink-0" /> Mastered
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-dark-300)] mt-2.5 font-medium leading-relaxed max-w-2xl">{roadmap.description}</p>
                </div>

                {/* Progress bar container */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="w-full md:w-52">
                    <div className="flex justify-between text-[10px] font-extrabold text-[var(--color-dark-300)] uppercase tracking-wider mb-2 leading-none">
                      <span>{solved}/{roadmap.totalProblems} completed</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    {/* High-contrast track slider */}
                    <div className="w-full bg-[var(--color-dark-700)] h-2 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] h-full rounded-full transition-all duration-700" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-[var(--color-dark-300)] hover:text-white transition-colors">
                    {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Expandable recommended problems checklist */}
              {isExpanded && (
                <div className="border-t border-[var(--color-dark-700)] bg-[var(--color-dark-900)]/40 p-5 sm:p-6 space-y-4">
                  <h4 className="text-[10px] font-bold text-[var(--color-dark-300)] uppercase tracking-wider">Recommended Roadmap Problems</h4>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {roadmap.problems && roadmap.problems.length > 0 ? (
                      roadmap.problems.map((problem, index) => {
                        const solvedStatus = isProblemSolved(problem.name);
                        return (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-dark-800)] border border-[var(--color-dark-700)] hover:border-[var(--color-primary)] transition-all group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <button 
                                onClick={() => handleMarkSolved(problem, roadmap.topic)}
                                className={`transition-colors cursor-pointer shrink-0 ${
                                  solvedStatus ? 'text-[var(--color-success)] hover:text-emerald-600' : 'text-[var(--color-dark-300)] hover:text-white'
                                }`}
                                title={solvedStatus ? 'Solved' : 'Mark as solved'}
                              >
                                {solvedStatus ? <FiCheckCircle size={18} /> : <FiCircle size={18} />}
                              </button>
                              <div className="min-w-0">
                                <span className={`text-xs sm:text-sm font-bold truncate block ${
                                  solvedStatus ? 'text-[var(--color-dark-300)] line-through' : 'text-white'
                                }`}>
                                  {problem.name}
                                </span>
                                <span className="text-[9px] uppercase font-extrabold text-[var(--color-dark-300)] mt-0.5 block">{problem.platform}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`tag ${
                                problem.difficulty === 'EASY' ? 'tag-easy' : 
                                problem.difficulty === 'MEDIUM' ? 'tag-medium' : 'tag-hard'
                              }`}>
                                {problem.difficulty}
                              </span>
                              
                              <a 
                                href={problem.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/60 rounded-xl transition-all border border-transparent hover:border-[var(--color-dark-600)]"
                                title="Link to problem site"
                              >
                                <FiExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-[var(--color-dark-300)] text-center py-4 font-semibold">No recommended exercises linked to this checkpoint yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
