/**
 * Generic data fetching hook with loading and error states.
 * Supports TypeScript generics and optional immediate fetch.
 */
import { useState, useEffect, useCallback } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => Promise<void>;
}

export const useFetch = <T,>(
  fetchFn: () => Promise<T>,
  immediate = true
): UseFetchReturn<T> => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const executeFetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      executeFetch();
    }
  }, [immediate, executeFetch]);

  return {
    ...state,
    refetch: executeFetch,
  };
};
