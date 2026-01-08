/**
 * Student API service - CRUD operations and search functionality.
 * Supports filtering by project and searching by code/name.
 */
import axiosInstance from "./axiosInstance";

export interface Student {
  id: number;
  codeNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  title: string;
  description: string;
  projectId: number;
  projectName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentRequest {
  codeNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  title: string;
  description: string;
  projectId: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const STUDENTS_ENDPOINT = "/students";

export const getStudentsByProject = async (projectId: number): Promise<Student[]> => {
  const response = await axiosInstance.get<ApiResponse<Student[]>>(`${STUDENTS_ENDPOINT}?projectId=${projectId}`);
  return response.data.data;
};

export const getStudentById = async (id: number): Promise<Student> => {
  const response = await axiosInstance.get<ApiResponse<Student>>(`${STUDENTS_ENDPOINT}/${id}`);
  return response.data.data;
};

export const createStudent = async (student: StudentRequest): Promise<Student> => {
  const response = await axiosInstance.post<ApiResponse<Student>>(STUDENTS_ENDPOINT, student);
  return response.data.data;
};

export const updateStudent = async (id: number, student: StudentRequest): Promise<Student> => {
  const response = await axiosInstance.put<ApiResponse<Student>>(`${STUDENTS_ENDPOINT}/${id}`, student);
  return response.data.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${STUDENTS_ENDPOINT}/${id}`);
};

export const searchStudents = async (query: string, projectId?: number): Promise<Student[]> => {
  const params = new URLSearchParams();
  params.set("query", query);
  if (projectId !== undefined) {
    params.set("projectId", projectId.toString());
  }
  const response = await axiosInstance.get<ApiResponse<Student[]>>(
    `${STUDENTS_ENDPOINT}/search?${params.toString()}`
  );
  return response.data.data;
};

export const searchStudentByCode = async (code: string): Promise<Student> => {
  const params = new URLSearchParams();
  params.set("code", code);
  const response = await axiosInstance.get<ApiResponse<Student>>(
    `${STUDENTS_ENDPOINT}/search/code?${params.toString()}`
  );
  return response.data.data;
};
