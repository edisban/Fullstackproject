/**
 * Project API service - CRUD operations for projects.
 * All endpoints return standardized ApiResponse format.
 */
import axiosInstance from "./axiosInstance";

export interface Project {
  id: number;
  name: string;
  description: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRequest {
  name: string;
  description: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const PROJECTS_ENDPOINT = "/projects";

export const getProjects = async (): Promise<Project[]> => {
  const response = await axiosInstance.get<ApiResponse<Project[]>>(PROJECTS_ENDPOINT);
  return response.data.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await axiosInstance.get<ApiResponse<Project>>(`${PROJECTS_ENDPOINT}/${id}`);
  return response.data.data;
};

export const createProject = async (project: ProjectRequest): Promise<Project> => {
  const response = await axiosInstance.post<ApiResponse<Project>>(PROJECTS_ENDPOINT, project);
  return response.data.data;
};

export const updateProject = async (id: number, project: ProjectRequest): Promise<Project> => {
  const response = await axiosInstance.put<ApiResponse<Project>>(`${PROJECTS_ENDPOINT}/${id}`, project);
  return response.data.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${PROJECTS_ENDPOINT}/${id}`);
};
