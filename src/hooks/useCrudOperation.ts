/**
 * Custom hook to handle CRUD operations with consistent error handling and success notifications.
 * Reduces code duplication across Dashboard and StudentsPage.
 */
import { useCallback } from "react";
import { useSnackbarContext } from "@/context/SnackbarContext";
import { getErrorMessage } from "@/types/errors";

interface UseCrudOperationOptions {
  onSuccess?: () => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useCrudOperation = () => {
  const { showSnackbar } = useSnackbarContext();

  const executeCrudOperation = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options: UseCrudOperationOptions = {}
    ): Promise<T | undefined> => {
      const {
        onSuccess,
        successMessage,
        errorMessage = "Operation failed",
      } = options;

      try {
        const result = await operation();
        if (successMessage) {
          showSnackbar(successMessage, "success");
        }
        if (onSuccess) {
          onSuccess();
        }
        return result;
      } catch (error: unknown) {
        showSnackbar(getErrorMessage(error, errorMessage), "error");
        return undefined;
      }
    },
    [showSnackbar]
  );

  return { executeCrudOperation };
};
