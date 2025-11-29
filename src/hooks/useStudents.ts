/**
 * Custom hook for student CRUD operations and search.
 * Fetches students by project ID and supports search by code/name.
 */
import { useState, useCallback, useEffect } from "react";
import { getStudentsByProject, createStudent, updateStudent, deleteStudent, searchStudents, Student } from "@/api/students";
import { getErrorMessage } from "@/types/errors";

interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  fetchStudents: () => Promise<void>;
  handleCreateStudent: (data: {
    codeNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    title: string;
    description: string;
    projectId: number;
  }) => Promise<void>;
  handleUpdateStudent: (
    id: number,
    data: {
      codeNumber: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      title: string;
      description: string;
      projectId: number;
    }
  ) => Promise<void>;
  handleDeleteStudent: (id: number) => Promise<void>;
  handleSearchStudents: (query: string) => Promise<void>;
}

export const useStudents = (projectId: number): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudentsByProject(projectId);
      setStudents(data || []);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to load students"));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleCreateStudent = useCallback(
    async (data: {
      codeNumber: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      title: string;
      description: string;
      projectId: number;
    }) => {
      try {
        await createStudent(data);
        await fetchStudents();
      } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Failed to create student"));
      }
    },
    [fetchStudents]
  );

  const handleUpdateStudent = useCallback(
    async (
      id: number,
      data: {
        codeNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        title: string;
        description: string;
        projectId: number;
      }
    ) => {
      try {
        await updateStudent(id, data);
        await fetchStudents();
      } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Failed to update student"));
      }
    },
    [fetchStudents]
  );

  const handleDeleteStudent = useCallback(
    async (id: number) => {
      try {
        await deleteStudent(id);
        await fetchStudents();
      } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Failed to delete student"));
      }
    },
    [fetchStudents]
  );

  const handleSearchStudents = useCallback(
    async (query: string): Promise<{ found: boolean; count: number }> => {
      setLoading(true);
      try {
        if (!query.trim()) {
          await fetchStudents();
          return { found: true, count: 0 };
        }
        const data = await searchStudents(query, projectId);
        setStudents(data || []);
        return { found: true, count: data?.length || 0 };
      } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Failed to search students"));
      } finally {
        setLoading(false);
      }
    },
    [projectId, fetchStudents]
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    fetchStudents,
    handleCreateStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    handleSearchStudents,
  };
};
