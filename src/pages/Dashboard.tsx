import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Stack,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  Project,
} from "@/api/projects";

type ProjectFormValues = {
  name: string;
  description: string;
  startDate: string;
};

const normalizeDateInput = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().split("T")[0];
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const createForm = useForm<ProjectFormValues>({
    defaultValues: { name: "", description: "", startDate: "" },
  });

  const editForm = useForm<ProjectFormValues>({
    defaultValues: { name: "", description: "", startDate: "" },
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error: any) {
  console.error("❌ Failed to fetch projects:", error);
  showSnackbar("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (editingProject) {
      editForm.reset({
        name: editingProject.name || "",
        description: editingProject.description || "",
        startDate: normalizeDateInput(editingProject.startDate),
      });
    }
  }, [editingProject, editForm]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateProject = async (values: ProjectFormValues) => {
    try {
      const newProj = await createProject(values);
      setProjects((prev) => [...prev, newProj]);
      createForm.reset();
      showSnackbar("Project created successfully!", "success");
    } catch (error: any) {
      const errorMsg = error.response?.data || "Failed to create project";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleEditProject = async (values: ProjectFormValues) => {
    if (!editingProject?.id) return;
    try {
      const updated = await updateProject(editingProject.id, values);
      setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
      setEditingProject(null);
      showSnackbar("Project updated successfully!", "success");
    } catch (error: any) {
      const errorMsg = error.response?.data || "Failed to update project";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
      showSnackbar("Project deleted successfully!", "success");
    } catch (error: any) {
      showSnackbar("Failed to delete project", "error");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      <Typography
        variant="h4"
        color="primary"
        fontWeight="bold"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
      >
        📋 Projects Dashboard
      </Typography>

      {/* ADD FORM */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          ➕ Create Project
        </Typography>
        <Box component="form" noValidate onSubmit={createForm.handleSubmit(handleCreateProject)}>
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Project name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Website Redesign"
                {...createForm.register("name", {
                  required: "Project name is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                })}
                error={!!createForm.formState.errors.name}
                helperText={createForm.formState.errors.name?.message}
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
                {...createForm.register("description")}
              />
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Start date
              </Typography>
              <TextField
                fullWidth
                type="date"
                {...createForm.register("startDate", {
                  validate: (value) =>
                    !value || !Number.isNaN(Date.parse(value)) || "Invalid date",
                })}
                error={!!createForm.formState.errors.startDate}
                helperText={createForm.formState.errors.startDate?.message}
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={createForm.formState.isSubmitting}
            >
              {createForm.formState.isSubmitting ? "Saving..." : "CREATE PROJECT"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* LIST */}
      {projects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No projects yet. Create your first one!
          </Typography>
        </Paper>
      ) : (
        <List>
          {projects.map((project) => (
            <ListItem
              key={project.id}
              sx={{
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                gap: 2,
                py: 2,
              }}
            >
              {editingProject?.id === project.id ? (
                <Box width="100%">
                  <Box
                    component="form"
                    noValidate
                    onSubmit={editForm.handleSubmit(handleEditProject)}
                  >
                    <Stack spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                          Name *
                        </Typography>
                        <TextField
                          fullWidth
                          {...editForm.register("name", {
                            required: "Name is required",
                          })}
                          error={!!editForm.formState.errors.name}
                          helperText={editForm.formState.errors.name?.message}
                        />
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                          Description
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          {...editForm.register("description")}
                        />
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                          Start date
                        </Typography>
                        <TextField
                          type="date"
                          fullWidth
                          {...editForm.register("startDate", {
                            validate: (value) =>
                              !value ||
                                !Number.isNaN(Date.parse(value)) ||
                                "Invalid date",
                          })}
                          error={!!editForm.formState.errors.startDate}
                          helperText={editForm.formState.errors.startDate?.message}
                        />
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} width="100%">
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          fullWidth
                          disabled={editForm.formState.isSubmitting}
                        >
                          {editForm.formState.isSubmitting ? "Saving..." : "💾 Save"}
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          fullWidth
                          onClick={() => setEditingProject(null)}
                        >
                          ❌ Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              ) : (
                <>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {project.name}
                      </Typography>
                    }
                    secondary={
                      <Box component="div">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                        >
                          {project.description || "No description"}
                        </Typography>
                        {project.startDate && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="div"
                            sx={{ mt: 0.5 }}
                          >
                            📅 Start date:{" "}
                            {new Date(project.startDate).toLocaleDateString("en-US")}
                          </Typography>
                        )}
                        {project.createdAt && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="div"
                          >
                            🕒 Created:{" "}
                            {new Date(project.createdAt).toLocaleString("en-US")}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} width="100%">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate(`/tasks/${project.id}`)}
                    >
                      📋 Students
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setEditingProject(project);
                        editForm.reset({
                          name: project.name,
                          description: project.description,
                          startDate: project.startDate || "",
                        });
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleDelete(project.id!)}
                    >
                      🗑️ Delete
                    </Button>
                  </Stack>
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;