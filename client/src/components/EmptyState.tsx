/**
 * Reusable empty state component for when no items exist.
 * Encourages user to create their first item with call-to-action button.
 */
import React, { memo } from "react";
import { Paper, Typography, Button } from "@mui/material";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  buttonLabel?: string;
  onCreateClick?: () => void;
}

const EmptyState = memo<EmptyStateProps>(({ 
  icon = "📦", 
  title, 
  description, 
  buttonLabel, 
  onCreateClick 
}) => {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: "center",
        backgroundColor: "rgba(81, 125, 115, 0.05)",
        border: "2px dashed rgba(81, 125, 115, 0.3)",
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {icon} {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {description}
      </Typography>
      {buttonLabel && onCreateClick && (
        <Button
          variant="contained"
          size="large"
          onClick={onCreateClick}
          sx={{ textTransform: "none" }}
        >
          ➕ {buttonLabel}
        </Button>
      )}
    </Paper>
  );
});

EmptyState.displayName = "EmptyState";

export default EmptyState;
