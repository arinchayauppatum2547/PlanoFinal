import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { getCategoryColor, getTaskIconColor, getCategoryIconPath } from '../utils/taskColors';
import { getUserTasks, getUserCompletedTasks } from '../utils/userStorage';
import imgImage4 from '../imports/TaskPage-1/1e9b89899dee90e5a681bd87e2642344fbd3ee93.png';
import logoPlano from '../imports/plano_dark.png';

interface WorkSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: string;
  progress: number;
  completed: boolean;
  workSessions?: WorkSession[];
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadTasks();
    }

    // Listen for task updates from other pages
    const handleTasksUpdated = () => {
      loadTasks();
    };

    window.addEventListener('tasks-updated', handleTasksUpdated);

    return () => {
      window.removeEventListener('tasks-updated', handleTasksUpdated);
    };
  }, [user]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      if (!user) return;

      const userTasks = getUserTasks(user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  });

  // Predefined categories and priorities
  const predefinedCategories = ['General', 'Work', 'Study', 'Personal'];
  const taskCategories = Array.from(new Set(tasks.map(t => t.category)));
  const allCategories = Array.from(new Set([...predefinedCategories, ...taskCategories]));
  const categories = ['All', ...allCategories];
  const priorities = ['All', 'high', 'medium', 'low'];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const categoryMatch = filterCategory === 'All' || task.category === filterCategory;
    const priorityMatch = filterPriority === 'All' || task.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  // Sort tasks by priority (high > medium > low) and then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Priority order
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // If same priority, sort by due date (earlier first)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Calendar data
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const previousMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => null);
  const allCalendarDays = [...previousMonthDays, ...daysInMonth];



  const getTaskTime = (index: number) => {
    const times = ['09:00 AM', '11:30 AM', '03:00 PM', '05:30 PM', '07:00 PM'];
    return times[index % times.length];
  };

  const calculateAverageTimePerTask = () => {
    if (!user) return '0h';

    // Get both active and completed tasks
    const completedTasks = getUserCompletedTasks(user.id);
    const allTasks = [...tasks, ...completedTasks];

    const tasksWithTime = allTasks.filter(task => task.workSessions && task.workSessions.length > 0);

    if (tasksWithTime.length === 0) return '0h';

    const totalMinutes = tasksWithTime.reduce((total, task) => {
      const taskTime = task.workSessions!.reduce((sum, session) => sum + session.duration, 0);
      return total + taskTime;
    }, 0);

    const avgMinutes = Math.round(totalMinutes / tasksWithTime.length);
    const hours = (avgMinutes / 60).toFixed(1);
    return `${hours}h`;
  };

  const getCompletedThisWeek = () => {
    if (!user) return 0;

    const completedTasks = getUserCompletedTasks(user.id);
    const now = new Date();

    // Get start of this week (Sunday)
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    // Count tasks completed this week
    return completedTasks.filter((task: any) => {
      const completedDate = new Date(task.completedAt);
      return completedDate >= thisWeekStart;
    }).length;
  };

  const calculateTodayCompletionPercentage = () => {
    if (!user) return 0;

    const completedTasks = getUserCompletedTasks(user.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count tasks completed today
    const todayCompletedCount = completedTasks.filter((task: any) => {
      const completedDate = new Date(task.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    // Total tasks = active tasks + all completed tasks
    const totalTasks = tasks.length + completedTasks.length;

    if (totalTasks === 0) return 0;

    return Math.round((todayCompletedCount / totalTasks) * 100);
  };

  const calculateOnTimeRate = () => {
    if (!user) return 0;

    const completedTasks = getUserCompletedTasks(user.id);

    if (completedTasks.length === 0) return 0;

    const onTimeTasks = completedTasks.filter((task: any) => {
      const completedDate = new Date(task.completedAt);
      const dueDate = new Date(task.dueDate);
      return completedDate <= dueDate;
    }).length;

    return Math.round((onTimeTasks / completedTasks.length) * 100);
  };

  return (
    <div className="bg-[#161616] relative w-full h-full overflow-hidden">
      {/* Background */}
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
          className="bg-[rgba(0,0,0,0.25)] flex gap-[20px] h-[49.75px] items-center px-[24px] rounded-[16.583px] shadow-[4.146px_4.146px_4.146px_0px_rgba(0,0,0,0.15)] w-[240px] cursor-pointer hover:opacity-90 transition-opacity"
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
          className="bg-[rgba(255,255,255,0)] flex gap-[20px] h-[49.75px] items-center px-[24px] rounded-[16.583px] w-[240px] hover:bg-[rgba(0,0,0,0.15)] transition-colors cursor-pointer"
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

      {/* Main Content */}
      <div className="absolute left-[300px] right-[30px] top-[30px] bottom-[30px] z-10 overflow-y-auto flex items-center justify-center">
        {/* Main Glass Container */}
        <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.25)] rounded-[24px] p-[24px] shadow-[0px_12px_40px_rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.4)] w-full max-w-[850px]">
          {/* Header with Date */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#1e5a4d] mb-1">
                Welcome back, {user?.user_metadata?.name || user?.email || 'User'}!
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#5a7a6f]">
                {tasks.filter(t => !t.completed).length} upcoming deadlines this week.
              </p>
            </div>
            <div className="text-right">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#5a7a6f] uppercase mb-0.5">
                TODAY
              </p>
              <p className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[28px] text-[#1e5a4d] leading-none">
                {format(today, 'd MMM yyyy').toUpperCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[220px_1fr_240px] gap-5">
            {/* Left Column - Calendar & GPA */}
            <div className="flex flex-col gap-3">
            {/* Mini Calendar */}
            <div
              onClick={() => navigate('/calendar')}
              className="backdrop-blur-[12px] bg-[rgba(244,240,236,0.9)] rounded-[18px] p-[16px] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] border border-[rgba(255,255,255,0.5)] cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-['Manrope:Bold',sans-serif] font-bold text-[14px] text-[#1e5a4d]">
                  {format(today, 'MMMM')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#5a7a6f] hover:text-[#1e5a4d]"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#5a7a6f] hover:text-[#1e5a4d]"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-[3px] mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center">
                    <p className="font-['Inter:Medium',sans-serif] text-[10px] text-[#7a9189]">
                      {day}
                    </p>
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-[4px]">
                {allCalendarDays.map((day, index) => {
                  const isToday = day ? isSameDay(day, new Date()) : false;

                  // Get tasks for this day
                  const dayTasks = day ? tasks.filter(task => isSameDay(new Date(task.dueDate), day)) : [];
                  const hasTasks = dayTasks.length > 0;

                  // Get the highest priority task for this day to determine dot color
                  let dotColor = '#7a9189';
                  if (hasTasks) {
                    const highestPriorityTask = dayTasks.sort((a, b) => {
                      const priorityOrder = { high: 3, medium: 2, low: 1 };
                      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
                    })[0];
                    const colors = getCategoryColor(highestPriorityTask.category, highestPriorityTask.priority as 'low' | 'medium' | 'high');
                    dotColor = colors.bg;
                  }

                  return (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-[5px] relative ${
                        isToday ? 'bg-[#5a7a6f]' : 'bg-transparent'
                      }`}
                    >
                      {day && (
                        <>
                          <p className={`font-['Inter:Medium',sans-serif] text-[10px] ${
                            isToday ? 'font-bold text-white' : 'text-[#7a9189]'
                          }`}>
                            {format(day, 'd')}
                          </p>
                          {hasTasks && (
                            <div
                              className="absolute bottom-[2px] w-[4px] h-[4px] rounded-full"
                              style={{ backgroundColor: isToday ? 'white' : dotColor }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Analytics Card */}
            <div className="backdrop-blur-[12px] bg-[rgba(244,240,236,0.9)] rounded-[18px] p-[16px] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] border border-[rgba(255,255,255,0.5)]">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5" fill="#1e5a4d" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <p className="font-['Inter:Bold',sans-serif] font-bold text-[13px] text-[#1e293b]">
                  Task Analytics
                </p>
              </div>

              {/* Completed This Week */}
              <div className="mb-3">
                <p className="font-['Inter:Medium',sans-serif] text-[10px] text-[#64748b] mb-1">
                  Completed This Week
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[28px] text-[#1e5a4d] leading-none">
                    {getCompletedThisWeek()}
                  </p>
                  <p className="font-['Inter:Medium',sans-serif] text-[11px] text-[#22c55e]">
                    ↗ {calculateTodayCompletionPercentage()}%
                  </p>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-[8px] bg-[#e2e8f0] rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-[#1e5a4d] rounded-full transition-all"
                    style={{ width: `${(getCompletedThisWeek() / Math.max(getCompletedThisWeek() + tasks.length, 1)) * 100}%` }}
                  />
                </div>
                <p className="font-['Inter:Regular',sans-serif] text-[9px] text-[#94a3b8] mt-1">
                  {getCompletedThisWeek() + tasks.length} total tasks
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/60 rounded-[10px] p-2">
                  <p className="font-['Inter:Medium',sans-serif] text-[9px] text-[#64748b] mb-0.5">
                    On-time Rate
                  </p>
                  <p className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] text-[#1e293b]">
                    {calculateOnTimeRate()}%
                  </p>
                </div>
                <div className="bg-white/60 rounded-[10px] p-2">
                  <p className="font-['Inter:Medium',sans-serif] text-[9px] text-[#64748b] mb-0.5">
                    Avg Time/Task
                  </p>
                  <p className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] text-[#1e293b]">
                    {calculateAverageTimePerTask()}
                  </p>
                </div>
              </div>

              {/* Top Focus Course */}
              <div>
                <p className="font-['Inter:Medium',sans-serif] text-[10px] text-[#64748b] mb-2">
                  Top Focus Course
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-[32px] h-[32px] bg-[#1e5a4d] rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <svg className="w-[16px] h-[16px]" fill="white" viewBox="0 0 24 24">
                      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter:SemiBold',sans-serif] font-semibold text-[11px] text-[#1e293b]">
                      {tasks.length > 0 ? tasks[0].category : 'Study'}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-[9px] text-[#64748b]">
                      26% completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Priority Tasks */}
          <div>
            <div className="backdrop-blur-[12px] bg-[rgba(240,242,245,0.85)] rounded-[18px] p-[18px] h-full shadow-[0px_8px_24px_rgba(0,0,0,0.08)] border border-[rgba(255,255,255,0.6)]">
              <div className="mb-4">
                <h3 className="font-['Manrope:Bold',sans-serif] font-bold text-[17px] text-[#1e293b] mb-3">
                  Priority Tasks
                </h3>

                {/* Filter Controls */}
                <div className="flex gap-2 mb-3">
                  {/* Category Filter */}
                  <div className="flex-1">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-white border border-[rgba(0,96,85,0.2)] rounded-[10px] px-3 py-2 font-['Inter:Medium',sans-serif] text-[12px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'All' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div className="flex-1">
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full bg-white border border-[rgba(0,96,85,0.2)] rounded-[10px] px-3 py-2 font-['Inter:Medium',sans-serif] text-[12px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority === 'All' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Result Count */}
                {(filterCategory !== 'All' || filterPriority !== 'All') && (
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-['Inter:Medium',sans-serif] text-[11px] text-[#64748b]">
                      {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''} found
                    </p>
                    <button
                      onClick={() => {
                        setFilterCategory('All');
                        setFilterPriority('All');
                      }}
                      className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-[#006055] hover:text-[#005047] transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {sortedTasks.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#64748b] mb-1">
                    {filterCategory !== 'All' || filterPriority !== 'All'
                      ? 'No tasks match your filters'
                      : 'No tasks yet'}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#94a3b8]">
                    {filterCategory !== 'All' || filterPriority !== 'All'
                      ? 'Try adjusting your filters'
                      : 'Click "Add New Task" to create one'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[520px] pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
                  {sortedTasks.map((task) => {
                    const colors = getCategoryColor(task.category, task.priority as 'low' | 'medium' | 'high');
                    const iconColor = getTaskIconColor(colors.bg);
                    const iconPath = getCategoryIconPath(task.category);

                    return (
                    <div
                      key={task.id}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className="backdrop-blur-[8px] bg-white rounded-[14px] p-[16px] cursor-pointer hover:shadow-md transition-all border border-[rgba(226,232,240,0.8)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-[10px] w-[40px] h-[40px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.bg }}>
                          <svg className="w-[20px] h-[20px]" fill={iconColor} viewBox="0 0 24 24">
                            <path d={iconPath}/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#1e293b] mb-1 truncate">
                            {task.title}
                          </h4>
                          <p className="font-['Inter:Regular',sans-serif] text-[11px] text-[#64748b]">
                            {task.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Today's Schedule */}
          <div>
            <div className="bg-[#7cb9f5] rounded-[18px] px-[20px] py-[22px] h-full shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
              <h3 className="font-['Inter:SemiBold',sans-serif] font-semibold text-[15px] text-white mb-1 leading-tight">
                Today's
              </h3>
              <h3 className="font-['Inter:SemiBold',sans-serif] font-semibold text-[15px] text-white mb-7 leading-tight">
                Schedule
              </h3>

              {todayTasks.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-white mb-1">
                    No tasks for today
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[rgba(255,255,255,0.8)]">
                    Enjoy your free time!
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex flex-col gap-[22px] overflow-y-auto max-h-[500px]">
                    {todayTasks.map((task, index) => {
                      const colors = getCategoryColor(task.category, task.priority as 'low' | 'medium' | 'high');
                      const iconColor = getTaskIconColor(colors.bg);
                      const iconPath = getCategoryIconPath(task.category);

                      return (
                      <div
                        key={task.id}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="relative flex items-start gap-[14px] cursor-pointer group"
                      >
                        {/* Category Icon */}
                        <div
                          className="relative z-10 w-[32px] h-[32px] rounded-[8px] flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: colors.bg }}
                        >
                          <svg className="w-[16px] h-[16px]" fill={iconColor} viewBox="0 0 24 24">
                            <path d={iconPath}/>
                          </svg>
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-['Inter:Medium',sans-serif] font-medium text-[9.5px] text-white mb-[4px] opacity-75 tracking-wide">
                            {getTaskTime(index)}
                          </p>
                          <h4 className="font-['Inter:SemiBold',sans-serif] font-semibold text-[12.5px] text-white mb-[3px] leading-[1.3] truncate">
                            {task.title}
                          </h4>
                          <p className="font-['Inter:Regular',sans-serif] text-[10px] text-white opacity-60 leading-[1.4] truncate">
                            {task.category}
                          </p>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
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
    </div>
  );
}
