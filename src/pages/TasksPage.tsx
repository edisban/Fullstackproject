import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  searchTaskByCode,
  searchTasksByName,
  Task,
} from "../api/tasks";

const TasksPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Task>({
    codeNumber: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    title: "",
    description: "",
    status: "ACTIVE",
    priority: "MEDIUM",
    dueDate: "",
    projectId: Number(projectId),
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasksByProject(Number(projectId));
      setTasks(data);
    } catch (error: any) {
      console.error("❌ Failed to fetch tasks:", error);
      showSnackbar("Αποτυχία φόρτωσης υπαλλήλων", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.codeNumber.trim()) {
      showSnackbar("Συμπλήρωσε όλα τα υποχρεωτικά πεδία!", "error");
      return;
    }

    try {
      const newTask = await createTask(formData);
      setTasks([...tasks, newTask]);
      setFormData({
        codeNumber: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        title: "",
        description: "",
        status: "ACTIVE",
        priority: "MEDIUM",
        dueDate: "",
        projectId: Number(projectId),
      });
      showSnackbar("Υπάλληλος προστέθηκε επιτυχώς!", "success");
    } catch (error: any) {
      console.error("❌ Failed to create task:", error);
      showSnackbar(error.response?.data || "Αποτυχία δημιουργίας υπαλλήλου", "error");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const updated = await updateTask(id, formData);
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      setFormData({
        codeNumber: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        title: "",
        description: "",
        status: "ACTIVE",
        priority: "MEDIUM",
        dueDate: "",
        projectId: Number(projectId),
      });
      showSnackbar("Υπάλληλος ενημερώθηκε επιτυχώς!", "success");
    } catch (error: any) {
      console.error("❌ Failed to update task:", error);
      showSnackbar("Αποτυχία ενημέρωσης υπαλλήλου", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Είσαι σίγουρος ότι θες να διαγράψεις τον υπάλληλο;")) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((t) => t.id !== id));
        showSnackbar("Υπάλληλος διαγράφηκε επιτυχώς!", "success");
      } catch (error: any) {
        console.error("❌ Failed to delete task:", error);
        showSnackbar("Αποτυχία διαγραφής υπαλλήλου", "error");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTasks();
      return;
    }

    try {
      // Προσπάθησε αναζήτηση με ΑΦΜ πρώτα
      const byCode = await searchTaskByCode(searchQuery);
      setTasks([byCode]);
    } catch {
      // Αν αποτύχει, ψάξε με όνομα
      try {
        const byName = await searchTasksByName(searchQuery);
        setTasks(byName);
      } catch (error) {
        showSnackbar("Δεν βρέθηκαν αποτελέσματα", "error");
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
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/dashboard")}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" ml={2}>
          👥 Υπάλληλοι Project #{projectId}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="🔍 Αναζήτηση (ΑΦΜ ή Όνομα)"
            placeholder="π.χ. 123456789 ή Γιάννης"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch}>
            Αναζήτηση
          </Button>
          <Button variant="outlined" onClick={fetchTasks}>
            Όλα
          </Button>
        </Stack>
      </Paper>

      {/* Add Form */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          ➕ Προσθήκη Υπαλλήλου
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="ΑΦΜ *"
              value={formData.codeNumber}
              onChange={(e) => setFormData({ ...formData, codeNumber: e.target.value })}
              required
            />
            <TextField
              label="Όνομα *"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <TextField
              label="Επώνυμο *"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Ημ. Γέννησης"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <TextField
              label="Θέση Εργασίας"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              select
              label="Κατάσταση"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="ACTIVE">Ενεργός</option>
              <option value="INACTIVE">Ανενεργός</option>
            </TextField>
          </Stack>
          <TextField
            label="Περιγραφή"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Button variant="contained" size="large" onClick={handleAdd}>
            ➕ ΠΡΟΣΘΗΚΗ ΥΠΑΛΛΗΛΟΥ
          </Button>
        </Stack>
      </Paper>

      {/* List */}
      {tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            Δεν υπάρχουν υπάλληλοι σε αυτό το project.
          </Typography>
        </Paper>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                borderBottom: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                py: 2,
              }}
            >
              {editingId === task.id ? (
                <Box width="100%">
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="ΑΦΜ"
                      defaultValue={task.codeNumber}
                      onChange={(e) => setFormData({ ...formData, codeNumber: e.target.value })}
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label="Όνομα"
                        defaultValue={task.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="Επώνυμο"
                        defaultValue={task.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" color="success" onClick={() => handleUpdate(task.id!)}>
                        💾 Αποθήκευση
                      </Button>
                      <Button variant="outlined" onClick={() => setEditingId(null)}>
                        ❌ Άκυρο
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              ) : (
                <>
                  <ListItemText
                    primary={task.firstName + " " + task.lastName + " (ΑΦΜ: " + task.codeNumber + ")"}
                    primaryTypographyProps={{
                      variant: "h6",
                      color: "primary",
                      fontWeight: "bold"
                    }}
                    secondary={
                      <Box component="div">
                        <Typography variant="body2" component="div">
                          Θέση: {task.title} | Κατάσταση: {task.status}
                        </Typography>
                        {task.dateOfBirth && (
                          <Typography variant="caption" component="div">
                            📅 Γέννηση: {new Date(task.dateOfBirth).toLocaleDateString("el-GR")}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingId(task.id!);
                        setFormData({ ...task, projectId: Number(projectId) });
                      }}
                    >
                      ✏️ Επεξεργασία
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(task.id!)}>
                      🗑️ Διαγραφή
                    </Button>
                  </Stack>
                </>
              )}
            </ListItem>
          ))}
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