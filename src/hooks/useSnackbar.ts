/**
 * Hook for managing snackbar notifications (success, error, warning, info).
 * Returns open state, message, severity, and control functions.
 */
import { useState } from "react";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface UseSnackbarReturn {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  handleClose: () => void;
}

export const useSnackbar = (): UseSnackbarReturn => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("success");

  const showSnackbar = (msg: string, sev: SnackbarSeverity = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    open,
    message,
    severity,
    showSnackbar,
    handleClose,
  };
};
