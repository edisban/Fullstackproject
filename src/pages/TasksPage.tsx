import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getErrorMessage, type ApiError } from "@/types/errors";
import {
  Box,
  Button,
  Typography,
  Skeleton,
  List,
  ListItem,
  TextField,
  Stack,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  MenuItem,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  Task,
} from "@/api/tasks";
import { getProjectById, type Project } from "@/api/projects";

type TaskFormValues = {
  codeNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  title: string;
  description: string;
  status: string;
  projectId: number;
};

const normalizeDateInput = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().split("T")[0];
};

const buildTaskDefaults = (projectId: number, overrides?: Partial<TaskFormValues>): TaskFormValues => ({
  codeNumber: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  title: "",
  description: "",
  status: "ACTIVE",
  projectId,
  ...overrides,
});

const TasksPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const numericProjectId = Number(projectId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");

  const taskForm = useForm<TaskFormValues>({
    defaultValues: buildTaskDefaults(numericProjectId),
  });

  const editTaskForm = useForm<TaskFormValues>({
    defaultValues: buildTaskDefaults(numericProjectId),
  });

  const searchForm = useForm<{ query: string }>({
    defaultValues: { query: "" },
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasksByProject(numericProjectId);
      setTasks(data);
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to load students"), "error");
    } finally {
      setLoading(false);
    }
  }, [numericProjectId]);

  useEffect(() => {
    if (!Number.isFinite(numericProjectId)) {
      return;
    }
    fetchTasks();
    getProjectById(numericProjectId)
      .then((project: Project) => setProjectName(project.name))
      .catch(() => setProjectName(""));
  }, [numericProjectId, fetchTasks]);

  useEffect(() => {
    taskForm.reset(buildTaskDefaults(numericProjectId));
  }, [numericProjectId, taskForm]);

  useEffect(() => {
    if (editingTask) {
      editTaskForm.reset(
        buildTaskDefaults(numericProjectId, {
          ...editingTask,
          dateOfBirth: normalizeDateInput(editingTask.dateOfBirth),
        })
      );
    }
  }, [editingTask, editTaskForm, numericProjectId]);

  const showSnackbar = useCallback((message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleAdd = useCallback(async (values: TaskFormValues) => {
    try {
      const payload = { ...values, projectId: numericProjectId };
      const newTask = await createTask(payload);
      setTasks((prev) => [...prev, newTask]);
      taskForm.reset(buildTaskDefaults(numericProjectId));
      showSnackbar("Student added successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to create student"), "error");
    }
  }, [numericProjectId, taskForm, showSnackbar]);

  const handleUpdate = useCallback(async (values: TaskFormValues) => {
    if (!editingTask?.id) return;
    try {
      const payload = { ...values, projectId: numericProjectId };
      const updated = await updateTask(editingTask.id, payload);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      setEditingTask(null);
      showSnackbar("Student updated successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to update student"), "error");
    }
  }, [editingTask, numericProjectId, showSnackbar]);

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
      showSnackbar("Student deleted successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to delete student"), "error");
    }
  }, [editingTask, showSnackbar]);

  const handleSearch = useCallback(async ({ query }: { query: string }) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchMessage("Enter a search term");
      return;
    }

    try {
      const results = await searchTasks(trimmed);
      setTasks(results);
      
      if (results.length === 0) {
        setSearchMessage("No results found.");
      } else {
        setSearchMessage(`Found ${results.length} student(s)`);
      }
    } catch (error: unknown) {
      setTasks([]);
      setSearchMessage("Search failed. Please try again.");
    }
  }, []);

  const resetSearch = useCallback(() => {
    searchForm.reset();
    setSearchMessage("");
    fetchTasks();
  }, [searchForm, fetchTasks]);

  if (!Number.isFinite(numericProjectId)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">Invalid project.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={{ xs: 2, sm: 3, md: 4 }}>
        <Box display="flex" alignItems="center" mb={3} gap={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={300} height={50} />
        </Box>
        
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={56} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ mb: 1 }} />
          <Stack direction="row" spacing={2} mt={2}>
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={80} />
            <Skeleton variant="rectangular" height={80} />
            <Skeleton variant="rectangular" height={80} />
          </Stack>
        </Paper>
      </Box>
    );
  }


  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      <Box display="flex" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
        <IconButton onClick={() => navigate("/dashboard")}> 
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
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Stack
          component="form"
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "flex-end" }}
          onSubmit={searchForm.handleSubmit(handleSearch)}
        >
          <Box width="100%">
            <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
              🔍 Search (Student ID or Name)
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. 123456789 or John"
              {...searchForm.register("query", {
                required: "Enter a search term",
              })}
              error={Boolean(searchForm.formState.errors.query)}
              helperText={searchForm.formState.errors.query?.message || ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.05rem',
                  py: 0.5,
                },
              }}
            />
          </Box>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              minHeight: '48px',
            }}
          >
            Search
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={resetSearch} 
            fullWidth
            size="large"
            sx={{ 
              textTransform: 'none',
              minHeight: '48px',
            }}
          >
            Show all
          </Button>
        </Stack>
        {searchMessage && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {searchMessage}
          </Typography>
        )}
      </Paper>

      {/* ADD FORM TOGGLE */}
      <Box mb={3}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowAddForm(!showAddForm)}
          fullWidth
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
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
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
            Add Student
          </Typography>
        <Stack component="form" spacing={2.5} onSubmit={taskForm.handleSubmit(handleAdd)}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {[
              {
                label: "Student ID *",
                name: "codeNumber" as const,
                placeholder: "e.g. 121212",
                rules: {
                  required: "Student ID is required",
                  minLength: { value: 5, message: "At least 5 characters" },
                },
                errorKey: taskForm.formState.errors.codeNumber,
              },
              {
                label: "First name *",
                name: "firstName" as const,
                placeholder: "e.g. Jack",
                rules: { required: "First name is required" },
                errorKey: taskForm.formState.errors.firstName,
              },
              {
                label: "Last name *",
                name: "lastName" as const,
                placeholder: "e.g. Sparrow",
                rules: { required: "Last name is required" },
                errorKey: taskForm.formState.errors.lastName,
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
                  {...taskForm.register(field.name, field.rules)}
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
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
                {...taskForm.register("dateOfBirth")}
              />
            </Stack>
            <Stack spacing={0.5} flex={1}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Job title *
              </Typography>
              <TextField 
                placeholder="e.g. Frontend" 
                {...taskForm.register("title", { required: "Job title is required" })}
                error={Boolean(taskForm.formState.errors.title)}
                helperText={taskForm.formState.errors.title?.message}
              />
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              Status
            </Typography>
            <Controller
              name="status"
              control={taskForm.control}
              rules={{ required: "Select a status" }}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  fullWidth
                  name={field.name}
                  value={field.value ?? "ACTIVE"}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </TextField>
              )}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              Description
            </Typography>
            <TextField
              multiline
              rows={2}
              placeholder="Role description or notes"
              {...taskForm.register("description")}
            />
          </Stack>
          <Button type="submit" variant="contained" size="large" fullWidth>
            ADD STUDENT
          </Button>
        </Stack>
      </Paper>
      )}

      {/* List */}
      {tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No students have been added to this project yet.
          </Typography>
        </Paper>
      ) : (
        <List>
          {tasks.map((task) => {
            const isEditing = editingTask?.id === task.id;
            return (
              <ListItem
                key={task.id}
                sx={{
                  borderBottom: "1px solid #ddd",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 2,
                  py: 2,
                }}
              >
                {isEditing ? (
                  <Box
                    component="form"
                    onSubmit={editTaskForm.handleSubmit(handleUpdate)}
                    width="100%"
                  >
                    <Stack spacing={2}>
                      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                        {[{
                          label: "Student ID *",
                          placeholder: "e.g. 121212",
                          name: "codeNumber" as const,
                          rules: { required: "Student ID is required" },
                          errorKey: editTaskForm.formState.errors.codeNumber,
                        },
                        {
                          label: "First name *",
                          placeholder: "e.g. John",
                          name: "firstName" as const,
                          rules: { required: "First name is required" },
                          errorKey: editTaskForm.formState.errors.firstName,
                        },
                        {
                          label: "Last name *",
                          placeholder: "e.g. Smith",
                          name: "lastName" as const,
                          rules: { required: "Last name is required" },
                          errorKey: editTaskForm.formState.errors.lastName,
                        }].map((field) => (
                          <Stack key={field.name} spacing={0.5} flex={1}>
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                              {field.label}
                            </Typography>
                            <TextField
                              fullWidth
                              placeholder={field.placeholder}
                              {...editTaskForm.register(field.name, field.rules)}
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
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            {...editTaskForm.register("dateOfBirth")}
                          />
                        </Stack>
                        <Stack spacing={0.5} flex={1}>
                          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                            Job title *
                          </Typography>
                          <TextField 
                            fullWidth 
                            placeholder="e.g. Frontend" 
                            {...editTaskForm.register("title", { required: "Job title is required" })}
                            error={Boolean(editTaskForm.formState.errors.title)}
                            helperText={editTaskForm.formState.errors.title?.message}
                          />
                        </Stack>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                          Status
                        </Typography>
                        <Controller
                          name="status"
                          control={editTaskForm.control}
                          render={({ field }) => (
                            <TextField
                              select
                              fullWidth
                              name={field.name}
                              value={field.value ?? "ACTIVE"}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              inputRef={field.ref}
                            >
                              <MenuItem value="ACTIVE">Active</MenuItem>
                              <MenuItem value="INACTIVE">Inactive</MenuItem>
                            </TextField>
                          )}
                        />
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                          Description
                        </Typography>
                        <TextField
                          multiline
                          rows={2}
                          placeholder="Role description or notes"
                          {...editTaskForm.register("description")}
                        />
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button type="submit" variant="contained" color="success" fullWidth>
                          💾 Save
                        </Button>
                        <Button variant="outlined" onClick={() => setEditingTask(null)} fullWidth>
                          ❌ Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Box width="100%">
                      <Typography variant="h6" color="primary" fontWeight="bold">
                      Fullname: {task.firstName} {task.lastName}  ID: {task.codeNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Role: {task.title || "-"} | Status: {task.status}
                      </Typography>
                      {task.dateOfBirth && (
                        <Typography variant="caption" color="text.secondary">
                          📅 Birth: {new Date(task.dateOfBirth).toLocaleDateString("en-US")}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} width={{ xs: "100%", sm: "auto" }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditingTask(task);
                        }}
                        fullWidth
                      >
                        ✏️ Edit
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(task.id!)} fullWidth>
                        🗑️ Delete
                      </Button>
                    </Stack>
                  </>
                )}
              </ListItem>
            );
          })}
        </List>
      )}


      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksPage;