/**
 * Custom hook for project CRUD operations.
 * Auto-fetches projects on mount and refreshes after mutations.
 */
import { useState, useCallback, useEffect } from "react";
import { getProjects, createProject, updateProject, deleteProject, Project } from "@/api/projects";
import { getErrorMessage } from "@/types/errors";

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  handleCreateProject: (data: { name: string; description: string }) => Promise<void>;
  handleUpdateProject: (id: number, data: { name: string; description: string }) => Promise<void>;
  handleDeleteProject: (id: number) => Promise<void>;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to load projects"));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateProject = useCallback(async (data: { name: string; description: string }) => {
    try {
      await createProject(data);
      await fetchProjects();
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to create project"));
    }
  }, [fetchProjects]);

  const handleUpdateProject = useCallback(async (id: number, data: { name: string; description: string }) => {
    try {
      await updateProject(id, data);
      await fetchProjects();
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to update project"));
    }
  }, [fetchProjects]);

  const handleDeleteProject = useCallback(async (id: number) => {
    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to delete project"));
    }
  }, [fetchProjects]);

  useEffect(() => {
    // Avoid unhandled promise rejections when the initial fetch fails
    fetchProjects().catch((error) => {
      console.error(error);
    });
  }, [fetchProjects]);

  return {
    projects,
    loading,
    fetchProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  };
};
