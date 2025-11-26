/**
 * Reusable notification snackbar for success/error/warning/info messages.
 * Auto-dismisses after 5 seconds with manual close option.
 */
import React, { memo } from "react";
import { Snackbar, Alert } from "@mui/material";

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = memo(
  ({ open, message, severity, onClose }) => {
    return (
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    );
  }
);

NotificationSnackbar.displayName = "NotificationSnackbar";

export default NotificationSnackbar;
