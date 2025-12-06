
import React, { useEffect, useState, useCallback } from "react";
import { getErrorMessage } from "@/types/errors";
import { useNavigate } from "react-router";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { Project } from "@/api/projects";
import { useProjects } from "@/hooks/useProjects";
import { useCrudOperation } from "@/hooks/useCrudOperation";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import ConfirmDialog from "@/components/ConfirmDialog";

type ProjectFormValues = {
  name: string;
  description: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading, handleCreateProject, handleUpdateProject, handleDeleteProject } = useProjects();
  const { executeCrudOperation } = useCrudOperation();
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
    await executeCrudOperation(
      () => handleCreateProject(values),
      {
        successMessage: "Project created successfully!",
        errorMessage: "Failed to create project",
        onSuccess: () => {
          createForm.reset();
          setShowCreateForm(false);
        }
      }
    );
  }, [handleCreateProject, createForm, executeCrudOperation]);

  const onEditProject = useCallback(async (values: ProjectFormValues) => {
    if (!editingProject?.id) return;
    await executeCrudOperation(
      () => handleUpdateProject(editingProject.id, values),
      {
        successMessage: "Project updated successfully!",
        errorMessage: "Failed to update project",
        onSuccess: () => setEditingProject(null)
      }
    );
  }, [editingProject, handleUpdateProject, executeCrudOperation]);

  const onDeleteProject = useCallback((id: number) => {
    setDeleteConfirm({ open: true, projectId: id });
  }, []);

  const confirmDelete = useCallback(async () => {
    const id = deleteConfirm.projectId;
    setDeleteConfirm({ open: false, projectId: null });
    
    if (!id) return;
    
    await executeCrudOperation(
      () => handleDeleteProject(id),
      {
        successMessage: "Project deleted successfully!",
        errorMessage: "Failed to delete project",
        onSuccess: () => {
          if (editingProject?.id === id) {
            setEditingProject(null);
          }
        }
      }
    );
  }, [deleteConfirm.projectId, editingProject, handleDeleteProject, executeCrudOperation]);

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

      
      <Box mb={4} display="flex" justifyContent="flex-start">
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowCreateForm(!showCreateForm)}
          fullWidth
        >
          {showCreateForm ? "❌ Close" : "➕ New Project"}
        </Button>
      </Box>

      
      {showCreateForm && (
        <ProjectForm
          mode="create"
          form={createForm}
          onSubmit={onCreateProject}
        />
      )}

      
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
    </Box>
  );
};

export default Dashboard;