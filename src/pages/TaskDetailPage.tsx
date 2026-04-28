import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTaskProgress, deleteTask, Task } from '../services/taskService';
import { format } from 'date-fns';
import imgImage4 from '../imports/TaskPage-1/1e9b89899dee90e5a681bd87e2642344fbd3ee93.png';
import logoPlano from '../imports/plano_dark.png';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface PortfolioFile {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [portfolioFiles, setPortfolioFiles] = useState<PortfolioFile[]>([]);
  const { accessToken, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && taskId) {
      loadTask();
    }
  }, [accessToken, taskId]);

  const loadTask = async () => {
    if (!accessToken || !taskId) return;

    setLoading(true);
    try {
      let tasks;
      if (accessToken === 'mock-token') {
        tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      } else {
        tasks = await getTasks(accessToken);
      }

      const foundTask = tasks.find((t: any) => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        setTitle(foundTask.title);
        setDescription(foundTask.description);
        setCategory(foundTask.category);
        setDueDate(foundTask.dueDate);
        setPriority(foundTask.priority);
        setProgress(foundTask.progress);
        setChecklist(foundTask.checklist || []);
        setPortfolioFiles(foundTask.portfolioFiles || []);
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error loading task:', error);
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!accessToken || !taskId || !task) return;

    setUpdating(true);
    try {
      if (accessToken === 'mock-token') {
        const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
        const updatedTasks = tasks.map((t: any) =>
          t.id === taskId
            ? {
                ...t,
                title,
                description,
                category,
                dueDate,
                priority,
                progress,
                checklist,
                portfolioFiles,
                completed: progress === 100,
                updatedAt: new Date().toISOString()
              }
            : t
        );
        localStorage.setItem('mock_tasks', JSON.stringify(updatedTasks));

        const updatedTask = updatedTasks.find((t: any) => t.id === taskId);
        setTask(updatedTask);

        // Notify other pages to refresh
        window.dispatchEvent(new Event('tasks-updated'));
      } else {
        const updatedTask = await updateTaskProgress(accessToken, taskId, progress);
        setTask(updatedTask);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setUpdating(false);
    }
  };

  const calculateProgressFromChecklist = (checklistItems: ChecklistItem[]) => {
    if (checklistItems.length === 0) return 0;
    const completedCount = checklistItems.filter(item => item.completed).length;
    return Math.round((completedCount / checklistItems.length) * 100);
  };

  const updateTaskWithChecklist = (newChecklist: ChecklistItem[]) => {
    const newProgress = calculateProgressFromChecklist(newChecklist);
    setProgress(newProgress);

    if (accessToken && taskId) {
      const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      const updatedTasks = tasks.map((t: any) =>
        t.id === taskId
          ? {
              ...t,
              checklist: newChecklist,
              progress: newProgress,
              completed: newProgress === 100,
              updatedAt: new Date().toISOString()
            }
          : t
      );
      localStorage.setItem('mock_tasks', JSON.stringify(updatedTasks));
      const updatedTask = updatedTasks.find((t: any) => t.id === taskId);
      setTask(updatedTask);

      // Notify other pages to refresh
      window.dispatchEvent(new Event('tasks-updated'));
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim() === '') return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem,
      completed: false
    };

    const updatedChecklist = [...checklist, newItem];
    setChecklist(updatedChecklist);
    setNewChecklistItem('');
    updateTaskWithChecklist(updatedChecklist);
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    updateTaskWithChecklist(updatedChecklist);
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== itemId);
    setChecklist(updatedChecklist);
    updateTaskWithChecklist(updatedChecklist);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: PortfolioFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          url: event.target?.result as string,
          uploadedAt: new Date().toISOString()
        };

        const updatedFiles = [...portfolioFiles, newFile];
        setPortfolioFiles(updatedFiles);
        updateTaskWithPortfolioFiles(updatedFiles);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleDeletePortfolioFile = (fileId: string) => {
    const updatedFiles = portfolioFiles.filter(file => file.id !== fileId);
    setPortfolioFiles(updatedFiles);
    updateTaskWithPortfolioFiles(updatedFiles);
  };

  const updateTaskWithPortfolioFiles = (files: PortfolioFile[]) => {
    if (accessToken && taskId) {
      const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      const updatedTasks = tasks.map((t: any) =>
        t.id === taskId
          ? {
              ...t,
              portfolioFiles: files,
              updatedAt: new Date().toISOString()
            }
          : t
      );
      localStorage.setItem('mock_tasks', JSON.stringify(updatedTasks));
      const updatedTask = updatedTasks.find((t: any) => t.id === taskId);
      setTask(updatedTask);

      // Notify other pages to refresh
      window.dispatchEvent(new Event('tasks-updated'));
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.round((x / width) * 100);
    setProgress(Math.min(100, Math.max(0, newProgress)));

    // Auto-update progress
    if (accessToken && taskId) {
      const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      const updatedTasks = tasks.map((t: any) =>
        t.id === taskId
          ? { ...t, progress: newProgress, completed: newProgress === 100, updatedAt: new Date().toISOString() }
          : t
      );
      localStorage.setItem('mock_tasks', JSON.stringify(updatedTasks));
      const updatedTask = updatedTasks.find((t: any) => t.id === taskId);
      setTask(updatedTask);

      // Notify other pages to refresh
      window.dispatchEvent(new Event('tasks-updated'));
    }
  };

  const handleDeleteTask = async () => {
    if (!accessToken || !taskId) return;
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      if (accessToken === 'mock-token') {
        const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
        const updatedTasks = tasks.filter((t: any) => t.id !== taskId);
        localStorage.setItem('mock_tasks', JSON.stringify(updatedTasks));

        // Notify other pages to refresh
        window.dispatchEvent(new Event('tasks-updated'));
      } else {
        await deleteTask(accessToken, taskId);
      }
      navigate('/home');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleMarkAsDone = async () => {
    if (!accessToken || !taskId) return;

    try {
      if (accessToken === 'mock-token') {
        const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');

        // Remove task from task list
        const updatedTasks = tasks.filter((t: any) => t.id !== taskId);
        localStorage.setItem('mock_tasks', JSON.stringify(updatedTasks));

        // Increment completed tasks count
        const completedCount = parseInt(localStorage.getItem('completed_tasks_count') || '0');
        localStorage.setItem('completed_tasks_count', (completedCount + 1).toString());

        // Notify other pages to refresh
        window.dispatchEvent(new Event('tasks-updated'));
      } else {
        // For real backend, update to 100% then delete
        await updateTaskProgress(accessToken, taskId, 100);
        await deleteTask(accessToken, taskId);
      }
      navigate('/home');
    } catch (error) {
      console.error('Error marking task as done:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#62fae3] text-[#005047]';
      case 'medium': return 'bg-[#e0e3e5] text-[#434655]';
      case 'low': return 'bg-[#d4e3ff] text-[#001c39]';
      default: return 'bg-[#d4e3ff] text-[#001c39]';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#161616] relative w-full h-full flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return null;
  }

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
      <div className="absolute left-[300px] right-[30px] top-[30px] bottom-[30px] z-10 overflow-y-auto">
        {/* Main Glass Container */}
        <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.25)] rounded-[24px] p-[24px] shadow-[0px_12px_40px_rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.4)] w-full max-w-[850px] mx-auto my-4">
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

          {/* Task Details Card */}
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.6)] rounded-[18px] p-[24px] border border-[rgba(255,255,255,0.5)]">
          {/* Title Input */}
          <div className="mb-5">
            <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055]">
                Task Progress
              </label>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#006055]">
                {progress}%
              </p>
            </div>

            <div
              className="relative w-full h-[14px] bg-[#e1e2ed] rounded-full"
            >
              <div
                className="h-full bg-[#006055] rounded-full transition-all relative"
                style={{ width: `${progress}%` }}
              >
                {/* Draggable Circle */}
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#b0e04f] rounded-full border-4 border-white shadow-md"
                  style={{ right: '-12px' }}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] mt-2 font-['Inter:Regular',sans-serif]">
              Progress is calculated from checklist below
            </p>
          </div>

          {/* Checklist Section */}
          <div className="mb-6">
            <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-3">
              Checklist
            </label>

            {/* Add New Checklist Item */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddChecklistItem();
                  }
                }}
                placeholder="Add new item..."
                className="flex-1 bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[10px] px-3 py-2 font-['Inter:Regular',sans-serif] text-[13px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
              />
              <button
                onClick={handleAddChecklistItem}
                className="bg-[#006055] text-white px-4 py-2 rounded-[10px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] hover:bg-[#005047] transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add
              </button>
            </div>

            {/* Checklist Items */}
            <div
              className="bg-white/90 rounded-[12px] border border-[rgba(0,96,85,0.2)] max-h-[300px] overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#006055 #f1f5f9'
              }}
            >
              {checklist.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#64748b]">
                    No checklist items yet. Add one above!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[rgba(0,96,85,0.1)]">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 hover:bg-[rgba(0,96,85,0.05)] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklistItem(item.id)}
                        className="w-5 h-5 rounded border-2 border-[#006055] text-[#006055] focus:ring-2 focus:ring-[#006055]/30 cursor-pointer"
                        style={{
                          accentColor: '#006055'
                        }}
                      />
                      <span
                        className={`flex-1 font-['Inter:Regular',sans-serif] text-[13px] ${
                          item.completed
                            ? 'text-[#64748b] line-through'
                            : 'text-[#006055]'
                        }`}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="text-[#ef4444] hover:text-[#dc2626] transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Portfolio Files Section */}
          <div className="mb-6">
            <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-3">
              Portfolio & Files
            </label>

            {/* Upload Area */}
            <div className="mb-3">
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 bg-white/70 border-2 border-dashed border-[rgba(0,96,85,0.3)] rounded-[12px] px-4 py-6 cursor-pointer hover:bg-white/90 hover:border-[#006055] transition-all"
              >
                <svg className="w-6 h-6 text-[#006055]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <div className="text-center">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055]">
                    Click to upload files or images
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] text-[11px] text-[#64748b] mt-1">
                    PNG, JPG, PDF, or any file type
                  </p>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="*/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Files Grid */}
            {portfolioFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-3 bg-white/90 rounded-[12px] border border-[rgba(0,96,85,0.2)] p-3 max-h-[250px] overflow-y-auto" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#006055 #f1f5f9'
              }}>
                {portfolioFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative group bg-[rgba(0,96,85,0.05)] rounded-[10px] p-2 hover:bg-[rgba(0,96,85,0.1)] transition-colors"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeletePortfolioFile(file.id)}
                      className="absolute top-1 right-1 bg-[#ef4444] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>

                    {/* File Preview */}
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-[8px] mb-2"
                      />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-[#006055] rounded-[8px] mb-2">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                      </div>
                    )}

                    {/* File Name */}
                    <p className="font-['Inter:Medium',sans-serif] text-[10px] text-[#006055] truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={async () => {
                await handleDeleteTask();
              }}
              className="flex-1 bg-[#ef4444] text-white px-4 py-3.5 rounded-lg font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] hover:bg-[#dc2626] transition-colors"
            >
              Delete
            </button>
            <button
              onClick={async () => {
                await handleUpdateTask();
                navigate('/home');
              }}
              disabled={updating}
              className="flex-1 bg-[#b0e04f] text-black px-4 py-3.5 rounded-lg font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] hover:bg-[#9dca3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={handleMarkAsDone}
              className="flex-1 bg-[#006055] text-white px-4 py-3.5 rounded-lg font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] hover:bg-[#005047] transition-colors"
            >
              Mark as Done
            </button>
          </div>
        </div>
        </div>
      </div>

    </div>
  );
}
