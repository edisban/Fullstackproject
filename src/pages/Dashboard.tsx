import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage, type ApiError } from "@/types/errors";
import {
  Box,
  Button,
  Typography,
  Skeleton,
  TextField,
  Stack,
  Paper,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
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
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to load projects"), "error");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (editingProject) {
      editForm.reset({
        name: editingProject.name || "",
        description: editingProject.description || "",
        startDate: normalizeDateInput(editingProject.startDate),
      });
    }
  }, [editingProject, editForm]);

  const showSnackbar = useCallback((message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCreateProject = useCallback(async (values: ProjectFormValues) => {
    try {
      const newProj = await createProject(values);
      setProjects((prev) => [...prev, newProj]);
      createForm.reset();
      showSnackbar("Project created successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to create project"), "error");
    }
  }, [createForm, showSnackbar]);

  const handleEditProject = useCallback(async (values: ProjectFormValues) => {
    if (!editingProject?.id) return;
    try {
      const updated = await updateProject(editingProject.id, values);
      setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
      setEditingProject(null);
      showSnackbar("Project updated successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to update project"), "error");
    }
  }, [editingProject, showSnackbar]);

  const handleDelete = useCallback(async (id: number) => {
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
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to delete project"), "error");
    }
  }, [editingProject, showSnackbar]);

  if (loading) {
    return (
      <Box p={{ xs: 2, sm: 3, md: 4 }}>
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="40%" height={20} />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={80} height={36} sx={{ mr: 1 }} />
                  <Skeleton variant="rectangular" width={80} height={36} sx={{ mr: 1 }} />
                  <Skeleton variant="rectangular" width={80} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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

      {/* CREATE FORM TOGGLE */}
      <Box mb={4}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowCreateForm(!showCreateForm)}
          fullWidth
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {showCreateForm ? "❌ Close Form" : "➕ Create New Project"}
        </Button>
      </Box>

      {/* ADD FORM */}
      {showCreateForm && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
            Create Project
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
                Start date *
              </Typography>
              <TextField
                fullWidth
                type="date"
                {...createForm.register("startDate", {
                  required: "Start date is required",
                  validate: (value) => {
                    if (!value) return "Start date is required";
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) {
                      return "Start date cannot be in the future";
                    }
                    return true;
                  }
                })}
                error={!!createForm.formState.errors.startDate}
                helperText={createForm.formState.errors.startDate?.message || " "}
                inputProps={{
                  max: new Date().toISOString().split('T')[0]
                }}
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
      )}

      {/* PROJECTS GRID */}
      {!projects || projects.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: "center",
            backgroundColor: 'rgba(81, 125, 115, 0.05)',
            border: '2px dashed rgba(81, 125, 115, 0.3)',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📦 No projects yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Create your first project to get started!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowCreateForm(true)}
            sx={{ textTransform: 'none' }}
          >
            ➕ Create Project
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              {editingProject?.id === project.id ? (
                <Card 
                  sx={{ 
                    height: '100%',
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <CardContent>
                    <Box
                      component="form"
                      noValidate
                      onSubmit={editForm.handleSubmit(handleEditProject)}
                    >
                      <Stack spacing={2}>
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                            Project Name
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
                            Start Date *
                          </Typography>
                          <TextField
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            {...editForm.register("startDate", {
                              required: "Start date is required",
                              validate: (value) => {
                                if (!value) return "Start date is required";
                                const selectedDate = new Date(value);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (selectedDate > today) {
                                  return "Start date cannot be in the future";
                                }
                                return true;
                              }
                            })}
                            error={!!editForm.formState.errors.startDate}
                            helperText={editForm.formState.errors.startDate?.message || " "}
                            inputProps={{
                              max: new Date().toISOString().split('T')[0]
                            }}
                          />
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={editForm.formState.isSubmitting}
                          >
                            💾 Save
                          </Button>
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setEditingProject(null)}
                          >
                            ❌ Cancel
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(81, 125, 115, 0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {project.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        height: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {project.description || "No description provided"}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    {project.startDate && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        📅 {new Date(project.startDate).toLocaleDateString("en-US")}
                      </Typography>
                    )}
                    {project.createdAt && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        🕒 Created {new Date(project.createdAt).toLocaleDateString("en-US")}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => navigate(`/tasks/${project.id}`)}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      📋 View Students
                    </Button>
                    <Stack direction="row" spacing={1} width="100%">
                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        onClick={() => setEditingProject(project)}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        size="small"
                        onClick={() => handleDelete(project.id!)}
                      >
                        🗑️
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              )}
            </Grid>
          ))}
        </Grid>
      )}

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