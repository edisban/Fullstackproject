import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useStudents } from "../useStudents";
import {
  getStudentsByProject,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
  searchStudentByCode,
  Student,
} from "@/api/students";

vi.mock("@/api/students", () => ({
  getStudentsByProject: vi.fn(),
  createStudent: vi.fn(),
  updateStudent: vi.fn(),
  deleteStudent: vi.fn(),
  searchStudents: vi.fn(),
  searchStudentByCode: vi.fn(),
}));

describe("useStudents", () => {
  const projectId = 12;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches students for the project on mount", async () => {
    const serverStudents: Student[] = [
      { id: 1, codeNumber: "123", firstName: "Ada", lastName: "Lovelace", dateOfBirth: "1815-12-10", title: "Eng", description: "Desc", projectId },
    ];
    vi.mocked(getStudentsByProject).mockResolvedValueOnce(serverStudents);

    const { result } = renderHook(() => useStudents(projectId));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.students).toEqual(serverStudents);
    expect(getStudentsByProject).toHaveBeenCalledWith(projectId);
  });

  it("surfaces a normalized error when fetch fails", async () => {
    vi.mocked(getStudentsByProject).mockRejectedValue({});

    const { result } = renderHook(() => useStudents(projectId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(result.current.fetchStudents()).rejects.toThrow("Failed to load students");
  });

  it("handles create/update/delete flows with refetch", async () => {
    const initial: Student[] = [{ id: 1, codeNumber: "100", firstName: "Lin", lastName: "Coder", dateOfBirth: "2000-01-01", title: "Dev", description: "Old", projectId }];
    const afterCreate: Student[] = [
      ...initial,
      { id: 2, codeNumber: "101", firstName: "New", lastName: "Student", dateOfBirth: "2001-02-02", title: "New", description: "New", projectId },
    ];
    const afterUpdate: Student[] = [{ id: 1, codeNumber: "100", firstName: "Lin", lastName: "Coder", dateOfBirth: "2000-01-01", title: "Dev", description: "New", projectId }, afterCreate[1]];
    const afterDelete: Student[] = [afterUpdate[1]];

    vi.mocked(getStudentsByProject)
      .mockResolvedValueOnce(initial)
      .mockResolvedValueOnce(afterCreate)
      .mockResolvedValueOnce(afterUpdate)
      .mockResolvedValueOnce(afterDelete);

    vi.mocked(createStudent).mockResolvedValue(afterCreate[1]);
    vi.mocked(updateStudent).mockResolvedValue(afterUpdate[0]);
    vi.mocked(deleteStudent).mockResolvedValue();

    const { result } = renderHook(() => useStudents(projectId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleCreateStudent({ codeNumber: "101", firstName: "New", lastName: "Student", dateOfBirth: "2001-02-02", title: "New", description: "New", projectId });
    });

    await waitFor(() => {
      expect(result.current.students).toEqual(afterCreate);
    });

    expect(createStudent).toHaveBeenCalledWith({ codeNumber: "101", firstName: "New", lastName: "Student", dateOfBirth: "2001-02-02", title: "New", description: "New", projectId });

    await act(async () => {
      await result.current.handleUpdateStudent(1, { codeNumber: "100", firstName: "Lin", lastName: "Coder", dateOfBirth: "2000-01-01", title: "Dev", description: "New", projectId });
    });

    await waitFor(() => {
      expect(result.current.students).toEqual(afterUpdate);
    });

    await act(async () => {
      await result.current.handleDeleteStudent(1);
    });

    await waitFor(() => {
      expect(result.current.students).toEqual(afterDelete);
    });

    expect(deleteStudent).toHaveBeenCalledWith(1);
    expect(getStudentsByProject).toHaveBeenCalledTimes(4);
  });

  it("searches by numeric code when query is digits", async () => {
    const student = { id: 50, codeNumber: "999", firstName: "Code", lastName: "Only", dateOfBirth: "1990-01-01", title: "" , description: "", projectId };
    vi.mocked(getStudentsByProject).mockResolvedValueOnce([]);
    vi.mocked(searchStudentByCode).mockResolvedValue(student as Student);

    const { result } = renderHook(() => useStudents(projectId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const outcome = await result.current.handleSearchStudents("999");
      expect(outcome).toEqual({ found: true, count: 1 });
    });

    expect(result.current.students).toEqual([student]);
  });

  it("searches by name fragment when query contains letters", async () => {
    const matches: Student[] = [
      { id: 5, codeNumber: "888", firstName: "Jane", lastName: "Doe", dateOfBirth: "1995-05-05", title: "Eng", description: "", projectId },
      { id: 6, codeNumber: "889", firstName: "Janet", lastName: "Roe", dateOfBirth: "1996-06-06", title: "Analyst", description: "", projectId },
    ];

    vi.mocked(getStudentsByProject).mockResolvedValueOnce([]);
    vi.mocked(searchStudents).mockResolvedValue(matches);

    const { result } = renderHook(() => useStudents(projectId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const outcome = await result.current.handleSearchStudents("jan");
      expect(outcome).toEqual({ found: true, count: matches.length });
    });

    expect(result.current.students).toEqual(matches);
    expect(searchStudents).toHaveBeenCalledWith("jan", projectId);
  });

  it("clears and refetches when query is empty", async () => {
    vi.mocked(getStudentsByProject)
      .mockResolvedValueOnce([{ id: 1, codeNumber: "1", firstName: "A", lastName: "B", dateOfBirth: "2000-01-01", title: "", description: "", projectId }])
      .mockResolvedValueOnce([{ id: 2, codeNumber: "2", firstName: "C", lastName: "D", dateOfBirth: "2001-01-01", title: "", description: "", projectId }]);

    const { result } = renderHook(() => useStudents(projectId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const outcome = await result.current.handleSearchStudents("   ");
      expect(outcome).toEqual({ found: true, count: 0 });
    });

    await waitFor(() => {
      expect(result.current.students).toEqual([{ id: 2, codeNumber: "2", firstName: "C", lastName: "D", dateOfBirth: "2001-01-01", title: "", description: "", projectId }]);
    });
  });
});
