import api from "./axiosInstance";

export interface Project {
  id?: number;
  name: string;
  description: string;
  startDate?: string;  // ✅ Αλλαγή από dateOfCreation
  createdAt?: string;
}

// 📦 Get all projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data;
};

// 📦 Get one project by ID
export const getProjectById = async (id: number): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// 📦 Create project
export const createProject = async (projectData: Project): Promise<Project> => {
  const payload = {
    name: projectData.name,
    description: projectData.description,
    startDate: projectData.startDate || new Date().toISOString().split("T")[0], // auto date
  };
  const response = await api.post("/projects", payload);
  return response.data;
};

// 📦 Update project
export const updateProject = async (
  id: number,
  projectData: Partial<Project>
): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

// 📦 Delete project
export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};