/**
 * Reusable form for creating and editing projects.
 * Integrates with react-hook-form for validation and state management.
 */
import React, { memo } from "react";
import { Paper, Typography, Button, TextField, Stack, Box } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

interface ProjectFormValues {
  name: string;
  description: string;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel?: () => void;
}

const ProjectForm = memo<ProjectFormProps>(
  ({ mode, form, onSubmit, onCancel }) => {
    return (
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          {mode === "create" ? "Create Project" : "Edit Project"}
        </Typography>
        <Box component="form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Project name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Website Redesign"
                aria-label="Project name"
                {...form.register("name", {
                  required: "Project name is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                })}
                error={!!form.formState.errors.name}
                helperText={form.formState.errors.name?.message}
              />
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Description
              </Typography>
              <TextField
                fullWidth
                placeholder="Describe the project..."
                multiline
                rows={3}
                {...form.register("description")}
              />
            </Stack>
            {mode === "create" ? (
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "CREATE PROJECT"}
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={form.formState.isSubmitting}
                >
                  💾 Save
                </Button>
                <Button variant="outlined" fullWidth onClick={onCancel}>
                  ❌ Cancel
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Paper>
    );
  }
);

ProjectForm.displayName = "ProjectForm";

export default ProjectForm;
