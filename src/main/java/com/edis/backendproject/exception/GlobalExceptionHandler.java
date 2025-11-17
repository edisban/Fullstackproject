package com.edis.backendproject.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
																 HttpServletRequest request) {
		Map<String, String> validationErrors = ex.getBindingResult()
				.getFieldErrors()
				.stream()
				.collect(Collectors.toMap(
					FieldError::getField,
					FieldError::getDefaultMessage,
					(existing, replacement) -> replacement,
					LinkedHashMap<String, String>::new));

		return respond(HttpStatus.BAD_REQUEST,
				ApiError.validation(HttpStatus.BAD_REQUEST,
					"Validation failed",
					request.getRequestURI(),
					validationErrors));
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex,
															  HttpServletRequest request) {
		Map<String, String> violations = ex.getConstraintViolations()
				.stream()
				.collect(Collectors.toMap(
					violation -> violation.getPropertyPath().toString(),
					ConstraintViolation::getMessage,
					(existing, replacement) -> replacement,
					LinkedHashMap<String, String>::new));

		return respond(HttpStatus.BAD_REQUEST,
				ApiError.validation(HttpStatus.BAD_REQUEST,
					"Constraint violation",
					request.getRequestURI(),
					violations));
	}

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<ApiError> handleEntityNotFound(EntityNotFoundException ex,
														 HttpServletRequest request) {
		return respond(HttpStatus.NOT_FOUND,
				ApiError.simple(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI()));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex,
														  HttpServletRequest request) {
		return respond(HttpStatus.BAD_REQUEST,
				ApiError.simple(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
		return respond(HttpStatus.INTERNAL_SERVER_ERROR,
				ApiError.simple(HttpStatus.INTERNAL_SERVER_ERROR,
					"Unexpected error occurred",
					request.getRequestURI()));
	}

	private ResponseEntity<ApiError> respond(HttpStatus status, ApiError apiError) {
		HttpStatus safeStatus = Objects.requireNonNull(status, "status must not be null");
		ApiError safeBody = Objects.requireNonNull(apiError, "apiError must not be null");
		return ResponseEntity.status(safeStatus).body(safeBody);
	}

	public static final class ApiError {

		private final Instant timestamp;
		private final int status;
		private final String error;
		private final String message;
		private final String path;
		private final Map<String, String> validationErrors;

		private ApiError(Instant timestamp,
					   int status,
					   String error,
					   String message,
					   String path,
					   Map<String, String> validationErrors) {
			this.timestamp = timestamp;
			this.status = status;
			this.error = error;
			this.message = message;
			this.path = path;
			this.validationErrors = validationErrors == null ? Map.of() : Map.copyOf(validationErrors);
		}

		public Instant getTimestamp() {
			return timestamp;
		}

		public int getStatus() {
			return status;
		}

		public String getError() {
			return error;
		}

		public String getMessage() {
			return message;
		}

		public String getPath() {
			return path;
		}

		public Map<String, String> getValidationErrors() {
			return validationErrors;
		}

		private static ApiError validation(HttpStatus status,
									   String message,
									   String path,
									   Map<String, String> validationErrors) {
			return new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, path, validationErrors);
		}

		private static ApiError simple(HttpStatus status, String message, String path) {
			return new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, path, Map.of());
		}
	}
}
