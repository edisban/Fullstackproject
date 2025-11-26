/**
 * Reusable confirmation dialog component.
 * Provides a Material-UI dialog for confirming destructive actions.
 */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "error" | "primary" | "secondary" | "success" | "info" | "warning";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "error",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      disableRestoreFocus
      transitionDuration={{ enter: 150, exit: 100 }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.55)", 
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,

          
          background: "#0f3028",
          border: "1px solid rgba(143,178,150,0.35)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.55)",

          p: 1.5,
          minWidth: 320,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#c8f3d0",
          textAlign: "center",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{
            color: "#cdeed6",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1.5,
          pb: 1.5,
        }}
      >
        <Button
          onClick={onCancel}
          color="inherit"
          sx={{
            px: 3,
            borderRadius: "12px",
            color: "#e3f7ed",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(143,178,150,0.25)",
            "&:hover": {
              background: "rgba(255,255,255,0.15)",
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          autoFocus
          sx={{
            px: 3,
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
