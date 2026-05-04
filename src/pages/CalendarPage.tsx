import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, Task } from '../services/taskService';
import { getUserTasks } from '../utils/userStorage';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { getCategoryColor } from '../utils/taskColors';
import imgCalendar from '../imports/Calendar/1e9b89899dee90e5a681bd87e2642344fbd3ee93.png';
import logoPlano from '../imports/plano_dark.png';

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { accessToken, user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && user) {
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
  }, [accessToken, user]);

  const loadTasks = async () => {
    if (!accessToken || !user) return;

    setLoading(true);
    try {
      if (accessToken === 'mock-token') {
        const userTasks = getUserTasks(user.id);
        setTasks(userTasks);
      } else {
        const fetchedTasks = await getTasks(accessToken);
        setTasks(fetchedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = getDay(monthStart);
  const previousMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => null);

  const allDays = [...previousMonthDays, ...daysInMonth];

  // Calculate number of rows needed
  const totalCells = allDays.length;
  const numRows = Math.ceil(totalCells / 7);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTasksForDay = (day: Date | null) => {
    if (!day) return [];
    return tasks.filter(task => isSameDay(new Date(task.dueDate), day));
  };

  return (
    <div className="bg-[#161616] relative w-full h-full overflow-hidden">
      <div className="absolute bg-[#161616] inset-0" />
      <img alt="" className="absolute max-w-none object-cover size-full" src={imgCalendar} />

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
          className="bg-[rgba(0,0,0,0.25)] flex gap-[20px] h-[48.921px] items-center px-[24px] rounded-[16.583px] shadow-[4.146px_4.146px_4.146px_0px_rgba(0,0,0,0.15)] w-[240px] cursor-pointer hover:opacity-90 transition-opacity"
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
      <div className="absolute left-[300px] right-[33px] top-[30px] bottom-[30px] z-10 flex flex-col justify-center">
        {/* Month Title with Navigation */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <button
            onClick={goToPreviousMonth}
            className="transition-all hover:scale-110 hover:opacity-80"
          >
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="rgba(140,164,155,0.8)">
              <path d="M15 18l-6-6 6-6v12z"/>
            </svg>
          </button>

          <h1 className="font-['Impact:Regular',sans-serif] text-[79.6px] text-[rgba(140,164,155,0.8)] text-center uppercase min-w-[400px]">
            {format(currentDate, 'MMMM yyyy')}
          </h1>

          <button
            onClick={goToNextMonth}
            className="transition-all hover:scale-110 hover:opacity-80"
          >
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="rgba(140,164,155,0.8)">
              <path d="M9 6l6 6-6 6V6z"/>
            </svg>
          </button>
        </div>

        {/* Today Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={goToToday}
            className="bg-[#aedf4b] hover:bg-[#9dca3f] px-6 py-2 rounded-full font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-black transition-colors"
          >
            Today: {format(new Date(), 'MMM d, yyyy')}
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-[11.608px] mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-[rgba(0,0,0,0)] flex h-[48.921px] items-center justify-center rounded-[16.583px] shadow-[4.146px_4.146px_4.146px_0px_rgba(0,0,0,0.15)]"
            >
              <p className="capitalize font-['Instrument_Sans:Medium',sans-serif] font-medium text-[19.9px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                {day}
              </p>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          className="grid grid-cols-7 rounded-[15px] overflow-hidden border border-[rgba(219,234,254,0.1)]"
          style={{
            gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
            height: '500px'
          }}
        >
          {allDays.map((day, index) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            const isToday = day ? isSameDay(day, new Date()) : false;

            return (
              <div
                key={index}
                className={`bg-[rgba(248,250,252,0.3)] border-r border-b border-[rgba(219,234,254,0.1)] p-[12px] relative ${
                  isToday ? 'bg-[rgba(174,223,75,0.2)]' : ''
                }`}
                onClick={() => day && navigate(`/tasks/new?date=${format(day, 'yyyy-MM-dd')}`)}
              >
                {day && (
                  <>
                    <p className={`font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] mb-2 ${
                      isToday ? 'text-white' : 'text-white'
                    }`}>
                      {format(day, 'd')}
                    </p>

                    <div className="flex flex-col gap-[4px]">
                      {dayTasks.slice(0, 2).map((task) => {
                        const colors = getCategoryColor(task.category, task.priority as 'low' | 'medium' | 'high');

                        return (
                        <div
                          key={task.id}
                          className="rounded-[6px] px-[8px] py-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tasks/${task.id}`);
                          }}
                        >
                          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[10px] truncate">
                            {task.title}
                          </p>
                        </div>
                      );
                      })}
                      {dayTasks.length > 2 && (
                        <p className="text-[10px] text-white">
                          +{dayTasks.length - 2} more
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
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
