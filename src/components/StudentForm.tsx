/**
 * Reusable form for creating and editing students.
 * Includes validation for code, names, date of birth, and status selection.
 */
import React from "react";
import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { StudentRequest } from "@/api/students";

interface StudentFormProps {
  mode: "create" | "edit";
  form: UseFormReturn<StudentRequest>;
  onSubmit: (data: StudentRequest) => void;
  onCancel?: () => void;
  maxDateOfBirth: string;
}

const StudentForm: React.FC<StudentFormProps> = React.memo(
  ({ mode, form, onSubmit, onCancel, maxDateOfBirth }) => {
    const isCreateMode = mode === "create";

    return (
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: isCreateMode ? 3 : 0, width: "100%" }}>
        {isCreateMode && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
          >
            Add Student
          </Typography>
        )}
        <Stack component="form" spacing={2.5} onSubmit={form.handleSubmit(onSubmit)}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {[
              {
                label: "Student ID *",
                name: "codeNumber" as const,
                placeholder: "e.g. 121212",
                rules: {
                  required: "Student ID is required",
                  minLength: { value: 5, message: "At least 5 characters" },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Student ID must contain only numbers"
                  }
                },
                errorKey: form.formState.errors.codeNumber,
              },
              {
                label: "First name *",
                name: "firstName" as const,
                placeholder: isCreateMode ? "e.g. Jack" : "e.g. John",
                rules: {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "First name must contain only letters"
                  }
                },
                errorKey: form.formState.errors.firstName,
              },
              {
                label: "Last name *",
                name: "lastName" as const,
                placeholder: isCreateMode ? "e.g. Sparrow" : "e.g. Smith",
                rules: {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Last name must contain only letters"
                  }
                },
                errorKey: form.formState.errors.lastName,
              },
            ].map((field) => (
              <Stack key={field.name} spacing={0.5} flex={1}>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  {field.label}
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder={field.placeholder}
                  aria-label={field.label}
                  fullWidth
                  {...form.register(field.name, field.rules)}
                  error={Boolean(field.errorKey)}
                  helperText={field.errorKey?.message}
                />
              </Stack>
            ))}
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Stack spacing={0.5} flex={1}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Date of birth
              </Typography>
              <TextField
                type="date"
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: maxDateOfBirth }}
                fullWidth
                aria-label="Date of birth"
                {...form.register("dateOfBirth")}
              />
            </Stack>
            <Stack spacing={0.5} flex={1}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Job title *
              </Typography>
              <TextField
                placeholder="e.g. Frontend"
                fullWidth
                aria-label="Job title"
                {...form.register("title", {
                  required: "Job title is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Job title must contain only letters"
                  }
                })}
                error={Boolean(form.formState.errors.title)}
                helperText={form.formState.errors.title?.message}
              />
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              Description
            </Typography>
            <TextField
              multiline
              rows={2}
              placeholder="Role description or notes"
              fullWidth
              aria-label="Description"
              {...form.register("description")}
            />
          </Stack>

          {isCreateMode ? (
            <Button type="submit" variant="contained" size="large" fullWidth>
              ADD STUDENT
            </Button>
          ) : (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button type="submit" variant="contained" color="success" fullWidth>
                💾 Save
              </Button>
              <Button variant="outlined" onClick={onCancel} fullWidth>
                ❌ Cancel
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    );
  }
);

StudentForm.displayName = "StudentForm";

export default StudentForm;
