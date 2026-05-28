import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, 
  FiBookmark, FiInbox, FiTag, FiCalendar,
  FiUploadCloud, FiFileText, FiDownload, FiEye, FiImage
} from 'react-icons/fi';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // PDF Viewer Modal State
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [activePdfTitle, setActivePdfTitle] = useState('');

  // Markdown Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'DSA_CONCEPT',
    tags: '',
    pinned: false
  });

  // File Upload Form State
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'DSA_CONCEPT',
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { label: 'DSA Concept', value: 'DSA_CONCEPT' },
    { label: 'Interview Tip', value: 'INTERVIEW_TIP' },
    { label: 'Code Snippet', value: 'CODE_SNIPPET' },
    { label: 'Other', value: 'OTHER' }
  ];

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notes');
      if (response.data.success) {
        setNotes(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load notes", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUploadInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData({
      ...uploadData,
      [name]: value
    });
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      category: 'DSA_CONCEPT',
      tags: '',
      pinned: false
    });
    setShowAddModal(true);
  };

  const handleOpenUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    setUploadData({
      title: '',
      category: 'DSA_CONCEPT',
      description: '',
      tags: ''
    });
    setShowUploadModal(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags ? note.tags.join(', ') : '',
      pinned: note.pinned || false
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
      if (editingNote) {
        await api.put(`/notes/${editingNote.id}`, payload);
        toast.success("Note updated");
      } else {
        await api.post('/notes', payload);
        toast.success("Note created successfully!");
      }
      setShowAddModal(false);
      fetchNotes();
    } catch (error) {
      toast.error("Failed to save note");
    }
  };

  // Drag & Drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      toast.error("Unsupported file format! Please upload PDF, Word, TXT, or common images.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is too large! Maximum allowed size is 15MB.");
      return;
    }
    
    setSelectedFile(file);
    if (!uploadData.title) {
      setUploadData(prev => ({
        ...prev,
        title: file.name.substring(0, file.name.lastIndexOf('.'))
      }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select or drop a file first!");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const fData = new FormData();
    fData.append("file", selectedFile);
    fData.append("title", uploadData.title);
    fData.append("category", uploadData.category);
    fData.append("description", uploadData.description);
    
    const tagsArr = uploadData.tags ? uploadData.tags.split(',').map(t => t.trim()) : [];
    tagsArr.forEach(tag => fData.append("tags", tag));

    try {
      await api.post('/notes/upload', fData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      toast.success("Document note uploaded successfully!");
      setShowUploadModal(false);
      fetchNotes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload document file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note/attachment? File records will be purged.")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Deleted successfully");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await api.patch(`/notes/${id}/pin`);
      fetchNotes();
    } catch (error) {
      toast.error("Failed to update pin state");
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (n.content && n.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (n.description && n.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (fileType) => {
    if (!fileType) return <FiFileText className="text-blue-400" size={24} />;
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) {
      return <FiFileText className="text-red-400" size={24} />;
    } else if (type.includes('word') || type.includes('officedocument')) {
      return <FiFileText className="text-blue-400" size={24} />;
    } else if (type.includes('image')) {
      return <FiImage className="text-cyan-400" size={24} />;
    } else {
      return <FiFileText className="text-emerald-400" size={24} />;
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleViewFile = (note) => {
    if (note.fileType && note.fileType.toLowerCase().includes('pdf')) {
      // Expose locally served static url
      const fileUrl = `http://localhost:8080${note.fileUrl}`;
      setActivePdfUrl(fileUrl);
      setActivePdfTitle(note.title);
    } else {
      window.open(`http://localhost:8080${note.fileUrl}`, '_blank');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Study Workspace</h1>
          <p className="text-xs sm:text-sm text-[var(--color-dark-300)] mt-1 font-semibold">Log complex algorithms, code snippets, or markdown study notes.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={handleOpenAdd}
            className="btn-primary uppercase tracking-wider text-xs font-bold py-3 cursor-pointer"
            id="create-note-workspace-btn"
          >
            <FiPlus size={18} /> Create Study Note
          </button>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between min-w-0">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar whitespace-nowrap">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${
              !selectedCategory 
                ? 'bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white border-transparent shadow-md shadow-indigo-500/10' 
                : 'bg-[var(--color-dark-800)] text-[var(--color-dark-300)] border-[var(--color-dark-700)] hover:text-white hover:border-[var(--color-dark-600)]'
            }`}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button 
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all whitespace-nowrap ${
                selectedCategory === c.value
                  ? 'bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white border-transparent shadow-md shadow-indigo-500/10' 
                  : 'bg-[var(--color-dark-800)] text-[var(--color-dark-300)] border-[var(--color-dark-700)] hover:text-white hover:border-[var(--color-dark-600)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 shrink-0">
          <FiSearch className="absolute left-3.5 top-3.5 text-[var(--color-dark-400)] text-sm" />
          <input 
            type="text" 
            placeholder="Search notes content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            id="notes-search-input"
          />
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-800 rounded-2xl border border-zinc-700/30 animate-pulse"></div>
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={`glass-card p-6 flex flex-col justify-between relative group border ${
                note.pinned ? 'border-[var(--color-primary-light)]/45 bg-[var(--color-dark-800)]/90 shadow-md shadow-indigo-500/5' : 'border-white/10'
              }`}
            >
              <button 
                onClick={() => handleTogglePin(note.id)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  note.pinned 
                    ? 'text-[var(--color-primary-light)] bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30' 
                    : 'text-[var(--color-dark-400)] hover:text-white hover:bg-[var(--color-dark-700)]'
                }`}
                title={note.pinned ? 'Unpin this note' : 'Pin this note'}
              >
                <FiBookmark size={15} fill={note.pinned ? 'currentColor' : 'none'} />
              </button>

              <div className="space-y-3.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex text-[9px] uppercase tracking-wider font-extrabold text-[var(--color-accent-light)] bg-[var(--color-accent)]/10 px-2.5 py-0.5 rounded-md border border-[var(--color-accent)]/20">
                    {note.category.replace('_', ' ')}
                  </span>
                  {note.isAttachment && (
                    <span className="inline-flex text-[9px] uppercase tracking-wider font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                      Attachment
                    </span>
                  )}
                </div>
                
                <h3 className="text-base font-extrabold text-white pr-6 truncate">{note.title}</h3>
                
                {note.isAttachment ? (
                  /* File note display content */
                  <div className="flex flex-col gap-3.5 p-3 rounded-xl bg-[var(--color-dark-900)] border border-[var(--color-dark-700)]">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="shrink-0">{getFileIcon(note.fileType)}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{note.fileName}</p>
                        <p className="text-[10px] text-[var(--color-dark-400)] font-semibold mt-0.5">{formatBytes(note.fileSize)}</p>
                      </div>
                    </div>
                    {note.description && (
                      <p className="text-xs text-[var(--color-dark-300)] font-semibold line-clamp-3 leading-relaxed mt-1">{note.description}</p>
                    )}
                  </div>
                ) : (
                  /* Note markdown wrapper body */
                  <div className="prose prose-invert text-xs text-[var(--color-dark-300)] overflow-hidden max-h-[120px] line-clamp-4 leading-relaxed font-medium custom-scrollbar pr-1">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--color-dark-700)]/45 flex items-center justify-between min-w-0">
                <div className="flex flex-wrap gap-1.5 min-w-0 mr-2">
                  {note.tags && note.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-0.5 text-[9px] text-[var(--color-dark-400)] font-bold uppercase truncate max-w-[80px]">
                      <FiTag className="shrink-0 text-[8px]" /> {t}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {note.isAttachment ? (
                    <>
                      <button 
                        onClick={() => handleViewFile(note)}
                        className="p-2 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/60 rounded-xl transition-all border border-transparent hover:border-[var(--color-dark-600)] cursor-pointer"
                        title="View Document"
                      >
                        <FiEye size={13} />
                      </button>
                      <a 
                        href={`http://localhost:8080${note.fileUrl}`} 
                        download={note.fileName}
                        className="p-2 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/60 rounded-xl transition-all border border-transparent hover:border-[var(--color-dark-600)] cursor-pointer"
                        title="Download File"
                      >
                        <FiDownload size={13} />
                      </a>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleOpenEdit(note)}
                      className="p-2 text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)]/60 rounded-xl transition-all border border-transparent hover:border-[var(--color-dark-600)] cursor-pointer"
                      title="Edit note"
                    >
                      <FiEdit2 size={13} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
                    title="Delete Note"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-3">
          <FiInbox className="text-[var(--color-dark-500)]" size={36} />
          <div>
            <p className="text-sm font-bold text-white">No Notes Logged</p>
            <p className="text-xs text-[var(--color-dark-300)] mt-0.5">Try searching different titles or log a new summary sheet.</p>
          </div>
        </div>
      )}

      {/* Add/Edit Markdown Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-white">
                {editingNote ? 'Edit Summary Note' : 'Create Study Note'}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Note Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field" 
                  placeholder="e.g. Master Recursion & Stack frames"
                  required
                  id="modal-note-title"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    id="modal-note-category"
                  >
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                  <input 
                    type="text" 
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="e.g. recursion, arrays, sorting"
                    id="modal-note-tags"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Derivation / Content (Markdown supported)</label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="input-field h-60 font-mono text-xs resize-none custom-scrollbar" 
                  placeholder="### Base Case Analysis..."
                  required
                  id="modal-note-content"
                />
              </div>

              <div className="flex items-center gap-2.5 pb-2">
                <input 
                  type="checkbox" 
                  name="pinned"
                  id="modal-note-pinned"
                  checked={formData.pinned}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-[var(--color-primary)] bg-[var(--color-dark-900)] border-[var(--color-dark-600)] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="modal-note-pinned" className="text-xs font-bold text-[var(--color-dark-200)] cursor-pointer select-none">Pin to top of workspace</label>
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
                  id="modal-note-save"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drag & Drop File Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-white">Upload Reference Document</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag-Drop Workspace target */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isDragActive 
                    ? 'border-[var(--color-primary-light)] bg-[var(--color-primary)]/10 scale-[0.98]' 
                    : selectedFile 
                      ? 'border-[var(--color-success)] bg-emerald-500/5' 
                      : 'border-[var(--color-dark-700)] bg-[var(--color-dark-900)]/45 hover:border-[var(--color-primary)]'
                }`}
                onClick={() => document.getElementById('upload-file-input').click()}
              >
                <input 
                  type="file" 
                  id="upload-file-input" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
                
                <div className="p-4 bg-[var(--color-dark-800)] text-[var(--color-primary-light)] rounded-2xl border border-[var(--color-dark-700)] mb-3 group-hover:scale-110 transition-transform">
                  <FiUploadCloud size={28} />
                </div>
                
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-white">Selected: {selectedFile.name}</p>
                    <p className="text-xs text-[var(--color-dark-400)] font-semibold mt-1">{formatBytes(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-white">Drag & drop your study document here</p>
                    <p className="text-xs text-[var(--color-dark-300)] font-semibold mt-1">Accepts PDF, DOCX, TXT, or images up to 15MB</p>
                  </div>
                )}
              </div>

              {/* Progress Bar during axios uploads */}
              {uploading && (
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] text-[var(--color-dark-300)] font-extrabold uppercase tracking-wider">
                    <span>Uploading attachment...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[var(--color-dark-700)] h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Document metadata fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Attachment Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={uploadData.title}
                    onChange={handleUploadInputChange}
                    className="input-field" 
                    placeholder="e.g. DP Cheatsheet v2"
                    required
                    id="upload-note-title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Category</label>
                  <select 
                    name="category"
                    value={uploadData.category}
                    onChange={handleUploadInputChange}
                    className="input-field cursor-pointer"
                    id="upload-note-category"
                  >
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                  <input 
                    type="text" 
                    name="tags"
                    value={uploadData.tags}
                    onChange={handleUploadInputChange}
                    className="input-field" 
                    placeholder="e.g. dp, revision, pdf"
                    id="upload-note-tags"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-dark-200)] uppercase tracking-wider mb-2">Short Description</label>
                <textarea 
                  name="description"
                  value={uploadData.description}
                  onChange={handleUploadInputChange}
                  className="input-field h-24 resize-none custom-scrollbar" 
                  placeholder="What is this document about? (e.g. Detailed notes on recursion trees)"
                  id="upload-note-desc"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-dark-700)]">
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)}
                  className="btn-ghost py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  disabled={uploading}
                  id="upload-note-submit"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Viewport Overlay Modal */}
      {activePdfUrl && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up max-w-5xl h-[85vh] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-extrabold text-white truncate max-w-xl">{activePdfTitle}</h2>
              <button 
                onClick={() => {
                  setActivePdfUrl(null);
                  setActivePdfTitle('');
                }}
                className="p-1.5 rounded-lg text-[var(--color-dark-300)] hover:text-white hover:bg-[var(--color-dark-700)] transition-colors cursor-pointer font-bold text-sm"
              >
                ✕ Close PDF
              </button>
            </div>
            
            {/* Embedded Native Browser PDF view module */}
            <div className="flex-1 w-full bg-[var(--color-dark-900)] rounded-2xl overflow-hidden border border-[var(--color-dark-700)] shadow-inner">
              <iframe 
                src={activePdfUrl} 
                className="w-full h-full border-none"
                title="Smart PDF Viewer Panel"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
