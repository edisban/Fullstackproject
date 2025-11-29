/**
 * Student management page for a specific project.
 * Supports CRUD operations, search by code/name, and status filtering.
 */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getErrorMessage, type ApiError } from "@/types/errors";
import { Box, Button, Typography, List, Paper, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Student } from "@/api/students";
import { getProjectById, type Project } from "@/api/projects";
import { useStudents } from "@/hooks/useStudents";
import { useCrudOperation } from "@/hooks/useCrudOperation";
import StudentSearchBar from "@/components/StudentSearchBar";
import StudentForm from "@/components/StudentForm";
import StudentListItem from "@/components/StudentListItem";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { normalizeDateInput, getTodayDate } from "@/utils/dateUtils";

type StudentFormValues = {
  codeNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  title: string;
  description: string;
  projectId: number;
};

const buildStudentDefaults = (projectId: number, overrides?: Partial<StudentFormValues>): StudentFormValues => ({
  codeNumber: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  title: "",
  description: "",
  projectId,
  ...overrides,
});

const StudentsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const numericProjectId = Number(projectId);

  const { students, loading, fetchStudents, handleCreateStudent, handleUpdateStudent, handleDeleteStudent, handleSearchStudents } = useStudents(numericProjectId);
  const { executeCrudOperation } = useCrudOperation();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; studentId: number | null }>({ open: false, studentId: null });

  const studentForm = useForm<StudentFormValues>({
    defaultValues: buildStudentDefaults(numericProjectId),
  });

  const editStudentForm = useForm<StudentFormValues>({
    defaultValues: buildStudentDefaults(numericProjectId),
  });

  const searchForm = useForm<{ query: string }>({
    defaultValues: { query: "" },
  });

  useEffect(() => {
    if (!Number.isFinite(numericProjectId)) {
      return;
    }
    getProjectById(numericProjectId)
      .then((project: Project) => setProjectName(project.name))
      .catch(() => setProjectName(""));
  }, [numericProjectId]);

  useEffect(() => {
    studentForm.reset(buildStudentDefaults(numericProjectId));
  }, [numericProjectId, studentForm]);

  useEffect(() => {
    if (editingStudent) {
      editStudentForm.reset(
        buildStudentDefaults(numericProjectId, {
          ...editingStudent,
          dateOfBirth: normalizeDateInput(editingStudent.dateOfBirth),
        })
      );
    }
  }, [editingStudent, editStudentForm, numericProjectId]);

  const onAddStudent = useCallback(async (values: StudentFormValues) => {
    const payload = { ...values, projectId: numericProjectId };
    await executeCrudOperation(
      () => handleCreateStudent(payload),
      {
        successMessage: "Student added successfully!",
        errorMessage: "Failed to create student",
        onSuccess: () => {
          studentForm.reset(buildStudentDefaults(numericProjectId));
          setShowAddForm(false);
        }
      }
    );
  }, [numericProjectId, studentForm, handleCreateStudent, executeCrudOperation]);

  const onUpdateStudent = useCallback(async (values: StudentFormValues) => {
    if (!editingStudent?.id) return;
    const payload = { ...values, projectId: numericProjectId };
    await executeCrudOperation(
      () => handleUpdateStudent(editingStudent.id, payload),
      {
        successMessage: "Student updated successfully!",
        errorMessage: "Failed to update student",
        onSuccess: () => setEditingStudent(null)
      }
    );
  }, [editingStudent, numericProjectId, handleUpdateStudent, executeCrudOperation]);

  const onDeleteStudent = useCallback((id: number) => {
    setDeleteConfirm({ open: true, studentId: id });
  }, []);

  const confirmDelete = useCallback(async () => {
    const id = deleteConfirm.studentId;
    setDeleteConfirm({ open: false, studentId: null });
    
    if (!id) return;
    
    await executeCrudOperation(
      () => handleDeleteStudent(id),
      {
        successMessage: "Student deleted successfully!",
        errorMessage: "Failed to delete student",
        onSuccess: () => {
          if (editingStudent?.id === id) {
            setEditingStudent(null);
          }
        }
      }
    );
  }, [deleteConfirm.studentId, editingStudent, handleDeleteStudent, executeCrudOperation]);

  const onSearch = useCallback(async ({ query }: { query: string }) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchMessage("Enter a search term");
      return;
    }

    try {
      const result = await handleSearchStudents(trimmed);
      setIsSearchActive(true);
      if (result.count === 0) {
        const isNumeric = /^[0-9]+$/.test(trimmed);
        setSearchMessage(isNumeric ? `No student found with ID: ${trimmed}` : `No students found matching: ${trimmed}`);
      } else {
        setSearchMessage(`Found ${result.count} student${result.count > 1 ? 's' : ''}`);
      }
    } catch (error: unknown) {
      setSearchMessage("Search failed. Please try again.");
    }
  }, [handleSearchStudents]);

  const resetSearch = useCallback(async () => {
    searchForm.reset();
    setSearchMessage("");
    setIsSearchActive(false);
    await executeCrudOperation(
      () => fetchStudents(),
      {
        errorMessage: "Failed to reload students"
      }
    );
  }, [searchForm, fetchStudents, executeCrudOperation]);

  const maxDateOfBirth = useMemo(() => getTodayDate(), []);

  if (!Number.isFinite(numericProjectId)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">Invalid project.</Typography>
      </Box>
    );
  }

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      <Box display="flex" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
        <IconButton onClick={() => navigate("/dashboard")} aria-label="back to dashboard"> 
          <ArrowBack sx={{ color: '#fff' }} />
        </IconButton>
        <Typography
          variant="h4"
          color="primary"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
        >
          👥 Project: {projectName ? projectName : projectId} 
        </Typography>
      </Box>

      {/* Search Bar */}
      <StudentSearchBar
        searchForm={searchForm}
        onSearch={onSearch}
        onReset={resetSearch}
        searchMessage={searchMessage}
      />

      {/* ADD FORM TOGGLE */}
      <Box mb={3}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowAddForm(!showAddForm)}
          fullWidth
          sx={{
            backgroundColor: showAddForm ? '#d32f2f' : undefined,
            '&:hover': {
              backgroundColor: showAddForm ? '#b71c1c' : undefined,
            }
          }}
        >
          {showAddForm ? "❌ Close Form" : "➕ Add New Student"}
        </Button>
      </Box>

      {/* Add Form */}
      {showAddForm && (
        <StudentForm
          mode="create"
          form={studentForm}
          onSubmit={onAddStudent}
          maxDateOfBirth={maxDateOfBirth}
        />
      )}

      {/* List */}
      {students.length === 0 ? (
        isSearchActive ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              border: "2px dashed rgba(255, 255, 255, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              🔍 No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No students match your search criteria
            </Typography>
          </Paper>
        ) : (
          <EmptyState
            icon="👨‍🎓"
            title="No students yet"
            description="Add your first student to this project!"
          />
        )
      ) : (
        <List>
          {students.map((student) => (
            <StudentListItem
              key={student.id}
              student={student}
              editingStudentId={editingStudent?.id ?? null}
              editForm={editStudentForm}
              onEdit={setEditingStudent}
              onCancelEdit={() => setEditingStudent(null)}
              onUpdate={onUpdateStudent}
              onDelete={onDeleteStudent}
              maxDateOfBirth={maxDateOfBirth}
              projectName={student.projectName || projectName}
            />
          ))}
        </List>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, studentId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />
    </Box>
  );
};

export default StudentsPage;