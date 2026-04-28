import { API_URL } from '../utils/supabase/client';
import { publicAnonKey } from '../utils/supabase/info';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getTasks = async (accessToken: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch tasks');
  }

  const data = await response.json();
  return data.tasks;
};

export const createTask = async (
  accessToken: string,
  taskData: {
    title: string;
    description?: string;
    dueDate: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
  }
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create task');
  }

  const data = await response.json();
  return data.task;
};

export const updateTask = async (
  accessToken: string,
  taskId: string,
  updates: Partial<Task>
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update task');
  }

  const data = await response.json();
  return data.task;
};

export const updateTaskProgress = async (
  accessToken: string,
  taskId: string,
  progress: number
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}/progress`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ progress }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update progress');
  }

  const data = await response.json();
  return data.task;
};

export const deleteTask = async (
  accessToken: string,
  taskId: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete task');
  }
};
