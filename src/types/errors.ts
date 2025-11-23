export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
}

export interface ApiError extends Error {
  response?: {
    status?: number;
    data?: ApiErrorResponse | string;
  };
}

export const getErrorMessage = (error: unknown, fallback: string = "An error occurred"): string => {
  if (!error) return fallback;

  const apiError = error as ApiError;
  const apiData = apiError?.response?.data;

  if (typeof apiData === "string") {
    return apiData;
  }

  if (apiData && typeof apiData === "object") {
    if (typeof apiData.message === "string" && apiData.message.trim().length > 0) {
      return apiData.message;
    }
    if (typeof apiData.error === "string") {
      return apiData.error;
    }
  }

  if (apiError?.message) {
    return apiError.message;
  }

  return fallback;
};
