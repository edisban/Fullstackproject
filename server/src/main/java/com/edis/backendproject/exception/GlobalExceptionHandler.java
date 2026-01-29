package com.edis.backendproject.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.edis.backendproject.dto.ApiResponse;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

/**
 * Centralized exception handler for all controllers.
 * Returns consistent ApiResponse format for validation errors, not found, conflicts, etc.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	private static final String VALIDATION_FAILED = "Validation failed";
	private static final String CONSTRAINT_VIOLATION = "Constraint violation";
	private static final String CODE_NUMBER_TAKEN = "This student ID is already taken";
	private static final String PROJECT_NAME_TAKEN = "This project name is already taken";
	private static final String DATA_INTEGRITY_ERROR = "Data integrity constraint violation";
	private static final String INVALID_CREDENTIALS = "Invalid username or password";
	private static final String UNEXPECTED_ERROR = "Unexpected error occurred";
	private static final String STUDENTS_CODE_KEY = "students_code_number_key";
	private static final String PROJECTS_NAME_KEY = "projects_name_key";

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
		Map<String, String> validationErrors = ex.getBindingResult()
				.getFieldErrors()
				.stream()
				.collect(Collectors.toMap(
					FieldError::getField,
					FieldError::getDefaultMessage,
					(existing, replacement) -> replacement,
					LinkedHashMap::new));

		// For single field errors, return a simple message instead of validation map
		if (validationErrors.size() == 1) {
			String errorMessage = validationErrors.values().iterator().next();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(ApiResponse.error(errorMessage));
		}

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiResponse.validationError(VALIDATION_FAILED, validationErrors));
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
		Map<String, String> violations = ex.getConstraintViolations()
				.stream()
				.collect(Collectors.toMap(
					violation -> violation.getPropertyPath().toString(),
					ConstraintViolation::getMessage,
					(existing, replacement) -> replacement,
					LinkedHashMap::new));

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiResponse.validationError(CONSTRAINT_VIOLATION, violations));
	}

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<ApiResponse<Void>> handleEntityNotFound(EntityNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiResponse.error(ex.getMessage()));
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(ApiResponse.error(INVALID_CREDENTIALS));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
		String message = ex.getMessage();
		if (message != null) {
			if (message.contains(STUDENTS_CODE_KEY)) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body(ApiResponse.error(CODE_NUMBER_TAKEN));
			}
			if (message.contains(PROJECTS_NAME_KEY)) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body(ApiResponse.error(PROJECT_NAME_TAKEN));
			}
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ApiResponse.error(DATA_INTEGRITY_ERROR));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
		log.error("Unhandled exception", ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ApiResponse.error(UNEXPECTED_ERROR));
	}
}