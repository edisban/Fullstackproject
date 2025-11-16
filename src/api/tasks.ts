import api from "./axiosInstance";

export interface Task {
  id?: number;
  codeNumber: string;      // AM (alias of codeNumber on backend)
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: string;
  projectId: number;
  createdAt?: string;
}

// 📦 Get tasks by project
export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  const response = await api.get(`/tasks/project/${projectId}`);
  return response.data;
};

// 📦 Get one task
export const getTaskById = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

// 📦 Create task
export const createTask = async (taskData: Task): Promise<Task> => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

// 📦 Update task
export const updateTask = async (id: number, taskData: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

// 📦 Delete task
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// 🔍 Search by AM (backend also accepts legacy 'code')
export const searchTaskByCode = async (code: string): Promise<Task> => {
  // Prefer AM param, backend also supports legacy 'code'
  const response = await api.get(`/tasks/search/code`, {
    params: { am: code, code },
  });
  return response.data;
};

// 🔍 Bonus: Search by name
export const searchTasksByName = async (name: string): Promise<Task[]> => {
  const response = await api.get(`/tasks/search/name?name=${name}`);
  return response.data;
};