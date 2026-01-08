package com.edis.backendproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standardized API response wrapper for all endpoints.
 * Includes success status, message, data payload, timestamp, and validation errors.
 */
@Data
@NoArgsConstructor
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private Map<String, String> validationErrors;

    private ApiResponse(boolean success, String message, T data, Map<String, String> validationErrors) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
        this.validationErrors = validationErrors;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, null);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, null);
    }

    public static <T> ApiResponse<T> validationError(String message, Map<String, String> validationErrors) {
        return new ApiResponse<>(false, message, null, validationErrors);
    }
}