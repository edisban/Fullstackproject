import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProjects } from "../useProjects";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  Project,
} from "@/api/projects";

vi.mock("@/api/projects", () => ({
  getProjects: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

describe("useProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches projects on mount and updates state", async () => {
    const serverProjects: Project[] = [
      { id: 1, name: "Alpha", description: "First" },
      { id: 2, name: "Beta", description: "Second" },
    ];
    vi.mocked(getProjects).mockResolvedValueOnce(serverProjects);

    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getProjects).toHaveBeenCalledTimes(1);
    expect(result.current.projects).toEqual(serverProjects);
  });

  it("surfaces a normalized error when fetch fails", async () => {
    vi.mocked(getProjects).mockRejectedValue({});

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(result.current.fetchProjects()).rejects.toThrow("Failed to load projects");
  });

  it("creates a project and refetches the list", async () => {
    const refreshedProjects: Project[] = [{ id: 99, name: "Gamma", description: "New" }];
    vi.mocked(getProjects)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(refreshedProjects);

    vi.mocked(createProject).mockResolvedValue({ id: 99, name: "Gamma", description: "New" });

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleCreateProject({ name: "Gamma", description: "New" });
    });

    await waitFor(() => {
      expect(result.current.projects).toEqual(refreshedProjects);
    });

    expect(createProject).toHaveBeenCalledWith({ name: "Gamma", description: "New" });
    expect(getProjects).toHaveBeenCalledTimes(2);
  });

  it("updates and deletes projects, refetching each time", async () => {
    vi.mocked(getProjects)
      .mockResolvedValueOnce([{ id: 1, name: "Alpha", description: "First" }])
      .mockResolvedValueOnce([{ id: 1, name: "Alpha", description: "Updated" }])
      .mockResolvedValueOnce([]);

    vi.mocked(updateProject).mockResolvedValue({ id: 1, name: "Alpha", description: "Updated" });
    vi.mocked(deleteProject).mockResolvedValue();

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleUpdateProject(1, { name: "Alpha", description: "Updated" });
    });

    await waitFor(() => {
      expect(result.current.projects).toEqual([{ id: 1, name: "Alpha", description: "Updated" }]);
    });

    await act(async () => {
      await result.current.handleDeleteProject(1);
    });

    await waitFor(() => {
      expect(result.current.projects).toEqual([]);
    });

    expect(updateProject).toHaveBeenCalledWith(1, { name: "Alpha", description: "Updated" });
    expect(deleteProject).toHaveBeenCalledWith(1);
    expect(getProjects).toHaveBeenCalledTimes(3);
  });
});
