import axios from "axios";
import api from "./axiosInstance";

/**
 * Performs a lightweight GET request against /projects to ensure that the backend
 * is reachable. Any HTTP response (2xx-5xx) counts as reachable; true network
 * failures surface as errors so the caller can flag the backend as offline.
 */
export const pingBackend = async (): Promise<void> => {
  try {
    await api.get("/projects", {
      params: { page: 0, size: 1 },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return;
    }
    throw error;
  }
};
