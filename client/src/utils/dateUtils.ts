/**
 * Date utility functions for form handling.
 * Normalizes date inputs to YYYY-MM-DD format.
 */
export const normalizeDateInput = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().split("T")[0];
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};
