import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createTask } from '../services/taskService';
import { getUserTasks, setUserTasks } from '../utils/userStorage';
import imgImage4 from '../imports/TaskPage-1/1e9b89899dee90e5a681bd87e2642344fbd3ee93.png';
import logoPlano from '../imports/plano_dark.png';

export default function NewTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { accessToken, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !user) return;

    setError('');
    setLoading(true);

    try {
      if (accessToken === 'mock-token') {
        const tasks = getUserTasks(user.id);
        const newTask = {
          id: 'task-' + Date.now(),
          userId: user.id,
          title,
          description,
          dueDate,
          category,
          priority,
          progress: 0,
          completed: false,
          checklist: [],
          portfolioFiles: [],
          workSessions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        setUserTasks(user.id, tasks);

        // Notify other pages to refresh
        window.dispatchEvent(new Event('tasks-updated'));
      } else {
        await createTask(accessToken, {
          title,
          description,
          dueDate,
          category,
          priority,
        });
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161616] relative w-full h-full overflow-hidden">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[852.383px] left-1/2 top-1/2 w-[1208.925px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
      </div>

      {/* Logo */}
      <div className="absolute left-[29.02px] top-[24.88px] z-10">
        <img src={logoPlano} alt="PLANO" className="h-[50px] w-auto" />
      </div>

      {/* Sidebar Navigation */}
      <div className="absolute left-[29.02px] top-[138.47px] flex flex-col gap-[13px] z-10">
        <button
          onClick={() => navigate('/home')}
          className="bg-[rgba(255,255,255,0)] flex gap-[20px] h-[49.75px] items-center px-[24px] rounded-[16.583px] w-[240px] hover:bg-[rgba(0,0,0,0.15)] transition-colors cursor-pointer"
        >
          <div className="relative shrink-0 size-[30px]">
            <svg className="block size-full" fill="white" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <p className="capitalize font-['Instrument_Sans:Medium',sans-serif] font-medium text-[18px] text-[#d9d9d9]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Home
          </p>
        </button>

        <button
          onClick={() => navigate('/tasks')}
          className="bg-[rgba(0,0,0,0.25)] flex gap-[20px] h-[49.75px] items-center px-[24px] rounded-[16.583px] shadow-[4.146px_4.146px_4.146px_0px_rgba(0,0,0,0.15)] w-[240px] cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="relative shrink-0 size-[26px]">
            <svg className="block size-full" fill="white" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          </div>
          <p className="capitalize font-['Instrument_Sans:Medium',sans-serif] font-medium text-[18px] text-[#d9d9d9]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Task
          </p>
        </button>

        <button
          onClick={() => navigate('/calendar')}
          className="bg-[rgba(255,255,255,0)] flex gap-[20px] h-[48.921px] items-center px-[24px] rounded-[16.583px] w-[240px] hover:bg-[rgba(0,0,0,0.15)] transition-colors cursor-pointer"
        >
          <div className="relative shrink-0 size-[26px]">
            <svg className="block size-full" fill="white" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>
          </div>
          <p className="capitalize font-['Instrument_Sans:Medium',sans-serif] font-medium text-[18px] text-[#d9d9d9]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Calendar
          </p>
        </button>

        <button
          onClick={() => navigate('/portfolio')}
          className="bg-[rgba(255,255,255,0)] flex gap-[20px] h-[48.921px] items-center px-[24px] rounded-[16.583px] w-[240px] hover:bg-[rgba(0,0,0,0.15)] transition-colors cursor-pointer"
        >
          <div className="relative shrink-0 size-[26px]">
            <svg className="block size-full" fill="white" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>
            </svg>
          </div>
          <p className="capitalize font-['Instrument_Sans:Medium',sans-serif] font-medium text-[18px] text-[#d9d9d9]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Portfolio
          </p>
        </button>
      </div>

      {/* Sidebar Add Task Button and Options */}
      <div className="absolute left-[29.02px] bottom-[50px] z-10 flex flex-col gap-[12px] w-[240px]">
        <button
          onClick={() => navigate('/tasks/new')}
          className="bg-[#b0e04f] flex gap-[6px] items-center justify-center py-[10px] rounded-[10px] w-full hover:bg-[#9dca3f] transition-colors cursor-pointer"
        >
          <svg className="size-[16px]" fill="black" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <p className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[15px] text-black">
            Add New Task
          </p>
        </button>

        {/* Help Center */}
        <button className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-[rgba(255,255,255,0.1)] rounded-[8px] transition-colors cursor-pointer">
          <svg className="size-[18px]" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.7)]">
            Help Center
          </p>
        </button>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-[rgba(255,255,255,0.1)] rounded-[8px] transition-colors cursor-pointer"
        >
          <svg className="size-[18px]" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.7)]">
            Sign Out
          </p>
        </button>
      </div>

      {/* Main Content */}
      <div className="absolute left-[300px] right-[30px] top-[30px] bottom-[30px] z-10 overflow-y-auto flex items-center justify-center">
        {/* Main Glass Container */}
        <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.25)] rounded-[24px] p-[24px] shadow-[0px_12px_40px_rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.4)] w-full max-w-[850px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/home')}
              className="text-[#1e5a4d] hover:text-[#006055] transition-colors flex items-center gap-2 font-['Inter:Medium',sans-serif] text-[14px]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
              Cancel
            </button>
          </div>

          {/* Task Form Card */}
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.6)] rounded-[18px] p-[24px] border border-[rgba(255,255,255,0.5)]">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title Input */}
              <div className="mb-5">
                <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter task title"
                  className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Manrope:Bold',sans-serif] font-bold text-[22px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                />
              </div>

              {/* Description Input */}
              <div className="mb-5">
                <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                  Task Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[14px] text-[#006055] resize-none focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Medium',sans-serif] text-[14px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                  >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Medium',sans-serif] text-[14px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date Input */}
              <div className="mb-6">
                <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Medium',sans-serif] text-[14px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                    style={{
                      colorScheme: 'light',
                    }}
                  />
                  <style>{`
                    input[type="date"]::-webkit-calendar-picker-indicator {
                      filter: invert(25%) sepia(58%) saturate(1844%) hue-rotate(142deg) brightness(93%) contrast(101%);
                      cursor: pointer;
                    }
                  `}</style>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3.5 rounded-lg font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#006055] text-white px-6 py-3.5 rounded-lg font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] hover:bg-[#005047] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
