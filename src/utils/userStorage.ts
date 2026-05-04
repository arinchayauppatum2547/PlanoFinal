// Helper functions for user-specific localStorage

export const getUserTasksKey = (userId: string) => `user_${userId}_tasks`;
export const getUserCompletedCountKey = (userId: string) => `user_${userId}_completed_tasks_count`;
export const getUserCompletedTasksKey = (userId: string) => `user_${userId}_completed_tasks`;
export const getUserPortfolioAboutKey = (userId: string) => `user_${userId}_portfolio_about_me`;
export const getUserPortfolioSkillsKey = (userId: string) => `user_${userId}_portfolio_skills`;

export const getUserTasks = (userId: string) => {
  return JSON.parse(localStorage.getItem(getUserTasksKey(userId)) || '[]');
};

export const setUserTasks = (userId: string, tasks: any[]) => {
  localStorage.setItem(getUserTasksKey(userId), JSON.stringify(tasks));
};

export const getUserCompletedCount = (userId: string) => {
  return parseInt(localStorage.getItem(getUserCompletedCountKey(userId)) || '0');
};

export const setUserCompletedCount = (userId: string, count: number) => {
  localStorage.setItem(getUserCompletedCountKey(userId), count.toString());
};

export const getUserPortfolioAbout = (userId: string) => {
  return localStorage.getItem(getUserPortfolioAboutKey(userId)) || '';
};

export const setUserPortfolioAbout = (userId: string, about: string) => {
  localStorage.setItem(getUserPortfolioAboutKey(userId), about);
};

export const getUserPortfolioSkills = (userId: string) => {
  return JSON.parse(localStorage.getItem(getUserPortfolioSkillsKey(userId)) || '[]');
};

export const setUserPortfolioSkills = (userId: string, skills: string[]) => {
  localStorage.setItem(getUserPortfolioSkillsKey(userId), JSON.stringify(skills));
};

export const getUserCompletedTasks = (userId: string) => {
  return JSON.parse(localStorage.getItem(getUserCompletedTasksKey(userId)) || '[]');
};

export const setUserCompletedTasks = (userId: string, tasks: any[]) => {
  localStorage.setItem(getUserCompletedTasksKey(userId), JSON.stringify(tasks));
};

export const addCompletedTask = (userId: string, task: any) => {
  const completedTasks = getUserCompletedTasks(userId);
  const completedTask = {
    ...task,
    completedAt: new Date().toISOString()
  };
  completedTasks.push(completedTask);
  setUserCompletedTasks(userId, completedTasks);
};
