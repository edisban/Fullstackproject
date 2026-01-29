/**
 * Individual project card with details and action buttons.
 * Displays project info and provides edit, delete, and view students navigation.
 */
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { Project } from "@/api/projects";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

const ProjectCard = memo<ProjectCardProps>(({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(81, 125, 115, 0.2)",
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
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            height: "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {project.description || "No description provided"}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {project.createdAt && (
          <Typography variant="caption" color="text.secondary" display="block">
            🕒 Created {new Date(project.createdAt).toLocaleDateString("en-US")}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => navigate(`/project/${project.id}`)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          📋 View Students
        </Button>
        <Stack direction="row" spacing={1} width="100%">
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={() => onEdit(project)}
          >
            ✏️ Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            size="small"
            onClick={() => onDelete(project.id!)}
          >
            🗑️
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
