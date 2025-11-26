/**
 * Projects dashboard with CRUD operations.
 * Displays project cards, create/edit forms, and navigation to student management.
 */
import React, { useEffect, useState, useCallback } from "react";
import { getErrorMessage } from "@/types/errors";
import { useNavigate } from "react-router";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { Project } from "@/api/projects";
import { useProjects } from "@/hooks/useProjects";
import { useSnackbar } from "@/hooks/useSnackbar";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import NotificationSnackbar from "@/components/NotificationSnackbar";
import ConfirmDialog from "@/components/ConfirmDialog";

type ProjectFormValues = {
  name: string;
  description: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading, handleCreateProject, handleUpdateProject, handleDeleteProject } = useProjects();
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; projectId: number | null }>({ open: false, projectId: null });

  const createForm = useForm<ProjectFormValues>({
    defaultValues: { name: "", description: "" },
  });

  const editForm = useForm<ProjectFormValues>({
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (editingProject) {
      editForm.reset({
        name: editingProject.name || "",
        description: editingProject.description || "",
      });
    }
  }, [editingProject, editForm]);

  const onCreateProject = useCallback(async (values: ProjectFormValues) => {
    try {
      await handleCreateProject(values);
      createForm.reset();
      setShowCreateForm(false);
      showSnackbar("Project created successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to create project"), "error");
    }
  }, [handleCreateProject, createForm, showSnackbar]);

  const onEditProject = useCallback(async (values: ProjectFormValues) => {
    if (!editingProject?.id) return;
    try {
      await handleUpdateProject(editingProject.id, values);
      setEditingProject(null);
      showSnackbar("Project updated successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to update project"), "error");
    }
  }, [editingProject, handleUpdateProject, showSnackbar]);

  const onDeleteProject = useCallback((id: number) => {
    setDeleteConfirm({ open: true, projectId: id });
  }, []);

  const confirmDelete = useCallback(async () => {
    const id = deleteConfirm.projectId;
    setDeleteConfirm({ open: false, projectId: null });
    
    if (!id) return;
    
    try {
      await handleDeleteProject(id);
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
      showSnackbar("Project deleted successfully!", "success");
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error, "Failed to delete project"), "error");
    }
  }, [deleteConfirm.projectId, editingProject, handleDeleteProject, showSnackbar]);

  if (loading) {
    return <Skeleton />;
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
        >
          {showCreateForm ? "❌ Close Form" : "➕ Create New Project"}
        </Button>
      </Box>

      {/* ADD FORM */}
      {showCreateForm && (
        <ProjectForm
          mode="create"
          form={createForm}
          onSubmit={onCreateProject}
        />
      )}

      {/* PROJECTS GRID */}
      {!projects || projects.length === 0 ? (
        <EmptyState 
          icon="📦"
          title="No projects yet"
          description="Create your first project to get started!"
        />
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              {editingProject?.id === project.id ? (
                <ProjectForm
                  mode="edit"
                  form={editForm}
                  onSubmit={onEditProject}
                  onCancel={() => setEditingProject(null)}
                />
              ) : (
                <ProjectCard
                  project={project}
                  onEdit={(proj) => setEditingProject(proj)}
                  onDelete={onDeleteProject}
                />
              )}
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will also delete all associated students."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, projectId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />

      <NotificationSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
    </Box>
  );
};

export default Dashboard;