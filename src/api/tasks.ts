import axiosInstance from "./axiosInstance";

export interface Task {
  id: number;
  codeNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  title: string;
  description: string;
  status: string;
  projectId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskRequest {
  codeNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  title: string;
  description: string;
  status: string;
  projectId: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const TASKS_ENDPOINT = "/tasks";

export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  const response = await axiosInstance.get<ApiResponse<Task[]>>(`${TASKS_ENDPOINT}?projectId=${projectId}`);
  return response.data.data;
};

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await axiosInstance.get<ApiResponse<Task>>(`${TASKS_ENDPOINT}/${id}`);
  return response.data.data;
};

export const createTask = async (task: TaskRequest): Promise<Task> => {
  const response = await axiosInstance.post<ApiResponse<Task>>(TASKS_ENDPOINT, task);
  return response.data.data;
};

export const updateTask = async (id: number, task: TaskRequest): Promise<Task> => {
  const response = await axiosInstance.put<ApiResponse<Task>>(`${TASKS_ENDPOINT}/${id}`, task);
  return response.data.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${TASKS_ENDPOINT}/${id}`);
};

export const searchTasks = async (query: string): Promise<Task[]> => {
  const response = await axiosInstance.get<ApiResponse<Task[]>>(
    `${TASKS_ENDPOINT}/search?query=${encodeURIComponent(query)}`
  );
  return response.data.data;
};
