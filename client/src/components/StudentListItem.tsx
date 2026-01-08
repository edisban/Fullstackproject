/**
 * Individual student list item with inline edit mode.
 * Displays student details and provides edit/delete actions.
 */
import React from "react";
import { ListItem, Box, Typography, Stack, Button } from "@mui/material";
import { Student } from "@/api/students";
import { UseFormReturn } from "react-hook-form";
import { StudentRequest } from "@/api/students";
import StudentForm from "./StudentForm";

interface StudentListItemProps {
  student: Student;
  editingStudentId: number | null;
  editForm: UseFormReturn<StudentRequest>;
  onEdit: (student: Student) => void;
  onCancelEdit: () => void;
  onUpdate: (data: StudentRequest) => void;
  onDelete: (id: number) => void;
  maxDateOfBirth: string;
  projectName?: string;
}

const StudentListItem: React.FC<StudentListItemProps> = React.memo(
  ({
    student,
    editingStudentId,
    editForm,
    onEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
    maxDateOfBirth,
    projectName,
  }) => {
    const isEditing = editingStudentId === student.id;

    return (
      <ListItem
        sx={{
          borderBottom: "1px solid #ddd",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 2,
          py: 2,
        }}
      >
        {isEditing ? (
          <StudentForm
            mode="edit"
            form={editForm}
            onSubmit={onUpdate}
            onCancel={onCancelEdit}
            maxDateOfBirth={maxDateOfBirth}
          />
        ) : (
          <>
            <Box width="100%">
              <Typography variant="h6" color="primary" fontWeight="bold">
                Fullname: {student.firstName} {student.lastName} ID: {student.codeNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {student.title || "-"}
                {projectName && ` | Project: ${projectName}`}
              </Typography>
              {student.dateOfBirth && (
                <Typography variant="caption" color="text.secondary">
                  📅 Birth: {new Date(student.dateOfBirth).toLocaleDateString("en-US")}
                </Typography>
              )}
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              width={{ xs: "100%", sm: "auto" }}
            >
              <Button
                variant="outlined"
                onClick={() => onEdit(student)}
                fullWidth
              >
                ✏️ Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(student.id!)}
                fullWidth
              >
                🗑️ Delete
              </Button>
            </Stack>
          </>
        )}
      </ListItem>
    );
  }
);

StudentListItem.displayName = "StudentListItem";

export default StudentListItem;
