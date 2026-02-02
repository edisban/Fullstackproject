package com.edis.backendproject.controller;

import com.edis.backendproject.dto.ApiResponse;
import com.edis.backendproject.dto.LoginRequest;
import com.edis.backendproject.dto.RegisterRequest;
import com.edis.backendproject.model.User;
import com.edis.backendproject.security.BearerTokenExtractor;
import com.edis.backendproject.service.TokenBlacklistService;
import com.edis.backendproject.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.security.JwtTokenProvider;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final TokenBlacklistService tokenBlacklistService;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> loginJson(@Valid @RequestBody LoginRequest loginRequest) {
        return authenticate(loginRequest);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> loginForm(@Valid LoginRequest loginRequest) {
        return authenticate(loginRequest);
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        User createdUser = userService.registerUser(registerRequest);
        Map<String, String> data = new HashMap<>();
        data.put("username", createdUser.getUsername());
        log.info("User {} registered successfully", createdUser.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Your account was created successfully.", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            Authentication authentication) {
        String token = BearerTokenExtractor.extract(authorizationHeader).orElse(null);
        if (token == null) {
            return ResponseEntity.badRequest().body(ApiResponse.<Void>error("Missing Authorization header"));
        }

        tokenBlacklistService.blacklistToken(token);

        String username = (authentication != null && authentication.getName() != null) ? authentication.getName() : "unknown";
        log.info("User {} logged out", username);

        return ResponseEntity.ok(ApiResponse.<Void>success("Logout successful", null));
    }

    private ResponseEntity<ApiResponse<Map<String, String>>> authenticate(LoginRequest loginRequest) {
        try {
            Authentication authentication = Objects.requireNonNull(
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    loginRequest.getUsername(),
                                    loginRequest.getPassword()
                            )
                    ),
                    "Authentication cannot be null"
            );

            String token = tokenProvider.generateToken(authentication);

            Map<String, String> data = new HashMap<>();
            data.put("token", token);
            data.put("username", loginRequest.getUsername());

            log.info("User {} authenticated successfully", loginRequest.getUsername());
            ResponseEntity<ApiResponse<Map<String, String>>> response = ResponseEntity.ok(ApiResponse.success("Login successful", data));
            return Objects.requireNonNull(response);
        } catch (AuthenticationException ex) {
            log.warn("Failed login attempt for {}", loginRequest.getUsername());
            ResponseEntity<ApiResponse<Map<String, String>>> unauthorizedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password"));
            return Objects.requireNonNull(unauthorizedResponse);
        } catch (Exception ex) {
            log.error("Unexpected login error for {}", loginRequest.getUsername(), ex);
            ResponseEntity<ApiResponse<Map<String, String>>> errorResponse = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Unexpected error occurred"));
            return Objects.requireNonNull(errorResponse);
        }
    }
}
