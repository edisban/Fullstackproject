import React, { useEffect, useState } from "react";
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
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  Project,
} from "../api/projects";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>({
    name: "",
    description: "",
    startDate: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error: any) {
      console.error("❌ Failed to fetch projects:", error);
      showSnackbar("Αποτυχία φόρτωσης projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      showSnackbar("Συμπλήρωσε το όνομα του project!", "error");
      return;
    }

    try {
      const newProj = await createProject(formData);
      setProjects([...projects, newProj]);
      setFormData({ name: "", description: "", startDate: "" });
      showSnackbar("Project δημιουργήθηκε επιτυχώς!", "success");
    } catch (error: any) {
      console.error("❌ Failed to create project:", error);
      const errorMsg = error.response?.data || "Αποτυχία δημιουργίας project";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleUpdate = async (id: number) => {
    const updated = projects.find((p) => p.id === id);
    if (!updated) return;

    try {
      const newData = await updateProject(id, {
        name: formData.name || updated.name,
        description: formData.description || updated.description,
        startDate: formData.startDate || updated.startDate,
      });

      setProjects((prev) => prev.map((p) => (p.id === id ? newData : p)));
      setEditingId(null);
      setFormData({ name: "", description: "", startDate: "" });
      showSnackbar("Project ενημερώθηκε επιτυχώς!", "success");
    } catch (error: any) {
      console.error("❌ Failed to update project:", error);
      const errorMsg = error.response?.data || "Αποτυχία ενημέρωσης project";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Είσαι σίγουρος ότι θες να διαγράψεις το project;")) {
      try {
        await deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
        showSnackbar("Project διαγράφηκε επιτυχώς!", "success");
      } catch (error: any) {
        console.error("❌ Failed to delete project:", error);
        showSnackbar("Αποτυχία διαγραφής project", "error");
      }
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
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📋 Projects Dashboard
      </Typography>

      {/* ADD FORM */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          ➕ Δημιουργία Project
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Project Name"
            placeholder="π.χ. Website Redesign"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            label="Description"
            placeholder="Περιγραφή του project..."
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Button variant="contained" size="large" onClick={handleAdd}>
            ➕ ΔΗΜΙΟΥΡΓΙΑ PROJECT
          </Button>
        </Stack>
      </Paper>

      {/* LIST */}
      {projects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            Δεν υπάρχουν projects. Δημιούργησε το πρώτο σου!
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
              {editingId === project.id ? (
                <Box width="100%">
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Όνομα"
                      defaultValue={project.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Περιγραφή"
                      multiline
                      rows={3}
                      defaultValue={project.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      defaultValue={project.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdate(project.id!)}
                      >
                        💾 Αποθήκευση
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ name: "", description: "", startDate: "" });
                        }}
                      >
                        ❌ Άκυρο
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              ) : (
                <>
                  <ListItemText
                    primaryTypographyProps={{ component: "div" }}
                    secondaryTypographyProps={{ component: "div" }}
                    primary={
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {project.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                        >
                          {project.description || "Χωρίς περιγραφή"}
                        </Typography>
                        {project.startDate && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            component="div"
                            mt={0.5}
                          >
                            📅 Ημερομηνία έναρξης:{" "}
                            {new Date(project.startDate).toLocaleDateString("el-GR")}
                          </Typography>
                        )}
                        {project.createdAt && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            component="div"
                          >
                            🕒 Δημιουργήθηκε:{" "}
                            {new Date(project.createdAt).toLocaleString("el-GR")}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        alert(`View tasks for project ${project.id}`);
                      }}
                    >
                      📋 Tasks
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setEditingId(project.id!);
                        setFormData({
                          name: project.name,
                          description: project.description,
                          startDate: project.startDate || "",
                        });
                      }}
                    >
                      ✏️ Επεξεργασία
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(project.id!)}
                    >
                      🗑️ Διαγραφή
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
