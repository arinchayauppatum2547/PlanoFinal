import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import imgImage4 from '../imports/TaskPage-1/1e9b89899dee90e5a681bd87e2642344fbd3ee93.png';
import logoPlano from '../imports/plano_dark.png';

interface PortfolioFile {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  taskTitle?: string;
  taskCategory?: string;
}

export default function PortfolioPage() {
  const [aboutMe, setAboutMe] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioFile[]>([]);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const { user, signOut, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPortfolioData();
  }, [accessToken]);

  const loadPortfolioData = () => {
    // Load About Me
    const savedAbout = localStorage.getItem('portfolio_about_me') || '';
    setAboutMe(savedAbout);

    // Load Skills
    const savedSkills = JSON.parse(localStorage.getItem('portfolio_skills') || '[]');
    setSkills(savedSkills);

    // Load Portfolio Items from all tasks
    const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
    const allPortfolioFiles: PortfolioFile[] = [];

    tasks.forEach((task: any) => {
      if (task.portfolioFiles && task.portfolioFiles.length > 0) {
        task.portfolioFiles.forEach((file: PortfolioFile) => {
          allPortfolioFiles.push({
            ...file,
            taskTitle: task.title,
            taskCategory: task.category
          });
        });
      }
    });

    setPortfolioItems(allPortfolioFiles);
  };

  const handleSaveAboutMe = () => {
    localStorage.setItem('portfolio_about_me', aboutMe);
    setIsEditingAbout(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
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
          className="bg-[rgba(0,0,0,0.25)] flex gap-[20px] h-[48.921px] items-center px-[24px] rounded-[16.583px] shadow-[4.146px_4.146px_4.146px_0px_rgba(0,0,0,0.15)] w-[240px] cursor-pointer hover:opacity-90 transition-opacity"
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
        <div className="backdrop-blur-[16px] bg-[rgba(255,255,255,0.25)] rounded-[24px] p-[24px] shadow-[0px_12px_40px_rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.4)] w-full max-w-[850px] mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-['Manrope:Bold',sans-serif] font-bold text-[28px] text-[#1e5a4d] mb-2">
              My Portfolio
            </h1>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#5a7a6f]">
              Showcase your skills and completed projects
            </p>
          </div>

          {/* About Me Section */}
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.6)] rounded-[18px] p-[20px] border border-[rgba(255,255,255,0.5)] mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#006055]">
                About Me
              </h2>
              <button
                onClick={() => {
                  if (isEditingAbout) {
                    handleSaveAboutMe();
                  } else {
                    setIsEditingAbout(true);
                  }
                }}
                className="text-[#006055] hover:text-[#005047] font-['Inter:Medium',sans-serif] text-[13px] transition-colors"
              >
                {isEditingAbout ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditingAbout ? (
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[14px] text-[#006055] resize-none focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
              />
            ) : (
              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#006055] whitespace-pre-wrap">
                {aboutMe || 'Click Edit to add information about yourself...'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* Skills Section */}
            <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.6)] rounded-[18px] p-[20px] border border-[rgba(255,255,255,0.5)]">
              <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#006055] mb-3">
                Skills
              </h2>

              {/* Add Skill Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add a skill..."
                  className="flex-1 bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[10px] px-3 py-2 font-['Inter:Regular',sans-serif] text-[13px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-[#006055] text-white px-3 py-2 rounded-[10px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] hover:bg-[#005047] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#64748b] italic">
                    No skills added yet
                  </p>
                ) : (
                  skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-[#006055] text-white px-3 py-1.5 rounded-full font-['Inter:Medium',sans-serif] text-[12px] flex items-center gap-2 group"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Feed/Stats Section */}
            <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.6)] rounded-[18px] p-[20px] border border-[rgba(255,255,255,0.5)]">
              <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#006055] mb-4">
                Activity Feed
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[#006055] rounded-full p-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter:Semi_Bold',sans-serif] text-[13px] text-[#006055]">
                      Total Projects
                    </p>
                    <p className="font-['Manrope:Bold',sans-serif] text-[20px] text-[#1e5a4d]">
                      {portfolioItems.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#b0e04f] rounded-full p-2">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter:Semi_Bold',sans-serif] text-[13px] text-[#006055]">
                      Skills Mastered
                    </p>
                    <p className="font-['Manrope:Bold',sans-serif] text-[20px] text-[#1e5a4d]">
                      {skills.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Showcase Section */}
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0.6)] rounded-[18px] p-[20px] border border-[rgba(255,255,255,0.5)]">
            <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[#006055] mb-4">
              Project Showcase
            </h2>

            {portfolioItems.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#64748b] opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#64748b] mb-1">
                  No projects yet
                </p>
                <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#94a3b8]">
                  Upload files in your tasks to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/90 rounded-[12px] border border-[rgba(0,96,85,0.2)] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    {item.type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-[#006055]">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#006055] truncate mb-1">
                        {item.name}
                      </p>
                      {item.taskTitle && (
                        <p className="font-['Inter:Regular',sans-serif] text-[11px] text-[#64748b] truncate">
                          From: {item.taskTitle}
                        </p>
                      )}
                      {item.taskCategory && (
                        <span className="inline-block mt-2 bg-[#006055] text-white px-2 py-0.5 rounded-full font-['Inter:Medium',sans-serif] text-[10px]">
                          {item.taskCategory}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
